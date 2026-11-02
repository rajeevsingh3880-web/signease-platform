package com.esign.platform.service;

import com.esign.platform.model.Document;
import com.esign.platform.model.SignerInvite;
import com.esign.platform.model.SigningRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final ObjectMapper objectMapper;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Value("${spring.mail.username:noreply@esignplatform.com}")
    private String fromEmail;

    @Value("${app.email.resend-api-key:}")
    private String resendApiKey;

    @Value("${app.email.resend-from:SignEase <onboarding@resend.dev>}")
    private String resendFrom;

    @Value("${app.email.brevo-api-key:}")
    private String brevoApiKey;

    @Value("${app.email.brevo-from:rajeevsingh3880@gmail.com}")
    private String brevoFrom;

    /**
     * Resilient Email Dispatcher:
     * 1. Attempts Resend HTTPS API (Port 443 - zero firewall blocks on Render Free)
     * 2. Attempts Brevo HTTPS API (Port 443)
     * 3. Falls back to Spring JavaMailSender (SMTP Port 587/465)
     */
    public boolean dispatchEmail(String toEmail, String subject, String plainText, String html) {
        // Option A: Resend REST API over HTTPS (Port 443)
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            boolean sent = sendViaResend(toEmail, subject, html, plainText);
            if (sent) return true;
        }

        // Option B: Brevo REST API over HTTPS (Port 443)
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            boolean sent = sendViaBrevo(toEmail, subject, html, plainText);
            if (sent) return true;
        }

        // Option C: Standard JavaMailSender (SMTP)
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            boolean isHtml = (html != null && !html.isBlank());
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, isHtml, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            if (isHtml) {
                helper.setText(plainText != null ? plainText : "", html);
            } else {
                helper.setText(plainText != null ? plainText : "", false);
            }

            mailSender.send(mimeMessage);
            log.info("Email successfully dispatched via SMTP to {}", toEmail);
            return true;
        } catch (Exception e) {
            log.warn("SMTP email dispatch failed for {}: {}. Note: Render Free Tier strictly blocks outbound SMTP ports 25, 465, 587. Provide RESEND_API_KEY in Render environment variables for HTTPS delivery.", toEmail, e.getMessage());
            return false;
        }
    }

    private boolean sendViaResend(String toEmail, String subject, String html, String plainText) {
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            Map<String, Object> payload = new HashMap<>();
            payload.put("from", (resendFrom != null && !resendFrom.isBlank()) ? resendFrom : "SignEase <onboarding@resend.dev>");
            payload.put("to", List.of(toEmail));
            payload.put("subject", subject);
            if (html != null && !html.isBlank()) {
                payload.put("html", html);
            }
            if (plainText != null && !plainText.isBlank()) {
                payload.put("text", plainText);
            }

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .timeout(Duration.ofSeconds(15))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Email dispatched successfully via Resend HTTPS API to {}", toEmail);
                return true;
            } else {
                log.warn("Resend API rejected email to {}: HTTP {} - {}", toEmail, response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            log.warn("Error calling Resend HTTPS API for {}: {}", toEmail, e.getMessage());
            return false;
        }
    }

    private boolean sendViaBrevo(String toEmail, String subject, String html, String plainText) {
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            Map<String, Object> payload = new HashMap<>();
            String senderEmail = (brevoFrom != null && !brevoFrom.isBlank()) ? brevoFrom : fromEmail;
            payload.put("sender", Map.of("name", "SignEase", "email", senderEmail));
            payload.put("to", List.of(Map.of("email", toEmail)));
            payload.put("subject", subject);
            if (html != null && !html.isBlank()) {
                payload.put("htmlContent", html);
            } else if (plainText != null) {
                payload.put("textContent", plainText);
            }

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .timeout(Duration.ofSeconds(15))
                    .header("api-key", brevoApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Email dispatched successfully via Brevo HTTPS API to {}", toEmail);
                return true;
            } else {
                log.warn("Brevo API rejected email to {}: HTTP {} - {}", toEmail, response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            log.warn("Error calling Brevo HTTPS API for {}: {}", toEmail, e.getMessage());
            return false;
        }
    }

    @Async
    public void sendSigningInvite(SigningRequest request, SignerInvite signer) {
        String signerEmail = signer != null ? signer.getSignerEmail() : "";
        String signerName = (signer != null && signer.getSignerName() != null) ? signer.getSignerName() : signerEmail;
        String senderName = (request != null && request.getRequestedBy() != null && request.getRequestedBy().getFullName() != null)
                ? request.getRequestedBy().getFullName() : "Document Requester";
        String documentTitle = (request != null && request.getDocument() != null && request.getDocument().getTitle() != null)
                ? request.getDocument().getTitle() : "Agreement";
        String inviteMessage = request != null ? request.getMessage() : "";
        java.time.LocalDateTime expiryDate = signer != null ? signer.getTokenExpiry() : java.time.LocalDateTime.now().plusDays(30);
        UUID token = signer != null ? signer.getSigningToken() : UUID.randomUUID();

        String signingUrl = baseUrl + "/sign/" + token;

        log.info("--------------------------------------------------");
        log.info(">>> DISPATCHING SIGNING INVITE FOR: {}", signerEmail);
        log.info(">>> Document: {}", documentTitle);
        log.info(">>> Sender: {}", senderName);
        log.info(">>> Direct Signing URL: {}", signingUrl);
        log.info("--------------------------------------------------");

        try {
            Context context = new Context();
            context.setVariable("signerName", signerName);
            context.setVariable("senderName", senderName);
            context.setVariable("documentTitle", documentTitle);
            context.setVariable("message", inviteMessage);
            context.setVariable("signingUrl", signingUrl);
            context.setVariable("expiryDate", expiryDate);

            String html = templateEngine.process("email/signing-request", context);

            String plainText = "Hello " + signerName + ",\n\n" +
                    senderName + " has requested your electronic signature on the document: \"" + documentTitle + "\".\n\n" +
                    (inviteMessage != null && !inviteMessage.isBlank() ? "Message: " + inviteMessage + "\n\n" : "") +
                    "To review and sign this agreement, please open the following link in your browser:\n" +
                    signingUrl + "\n\n" +
                    "This link is unique to you and does not require an account.\n\n" +
                    "Best regards,\n" +
                    "The SignEase Team";

            dispatchEmail(signerEmail, "Signature Requested: " + documentTitle, plainText, html);
        } catch (Exception e) {
            log.error("Could not complete signing invite dispatch to {}: {}", signerEmail, e.getMessage());
        }
    }

    @Async
    public void sendOtpCode(SignerInvite signer, String otpCode) {
        log.info("==================================================");
        log.info(">>> SIGNER OTP VERIFICATION CODE: [{}] for {}", otpCode, signer.getSignerEmail());
        log.info("==================================================");

        String subject = "Your One-Time Passcode (OTP) for Document Signing";
        String text = "Your OTP verification code is: " + otpCode + ". This code expires in 10 minutes.";
        dispatchEmail(signer.getSignerEmail(), subject, text, null);
    }

    @Async
    public void sendAadhaarOtpCode(SignerInvite signer, String otpCode, String maskedAadhaar) {
        log.info("==================================================");
        log.info(">>> AADHAAR e-KYC OTP CODE: [{}] for Aadhaar [{}] ({})", otpCode, maskedAadhaar, signer.getSignerEmail());
        log.info("==================================================");

        String subject = "UIDAI Aadhaar Authentication OTP for Document Signing";
        String text = "Dear " + signer.getSignerName() + ",\n\n" +
                "Your One-Time Password (OTP) for Aadhaar eSign identity authentication (Aadhaar: " + maskedAadhaar + ") is: " + otpCode + ".\n\n" +
                "This OTP is valid for 10 minutes. Under Section 3A of the Information Technology Act, 2000, this OTP authorizes the electronic signature of the requested document.\n\n" +
                "Do not share this OTP with anyone for your security.";

        dispatchEmail(signer.getSignerEmail(), subject, text, null);
    }

    @Async
    public void sendRegistrationOtpCode(String toEmail, String otpCode) {
        log.info("==================================================");
        log.info(">>> REGISTRATION EMAIL AUTHENTICATION OTP: [{}] for {}", otpCode, toEmail);
        log.info("==================================================");

        String subject = "Verify Your Email Address - SignEase Platform";
        String text = "Welcome to SignEase!\n\n" +
                "To verify that your email address is authentic and complete your account setup, please enter the following One-Time Passcode (OTP):\n\n" +
                "Verification OTP: " + otpCode + "\n\n" +
                "This code is valid for 10 minutes.\n\n" +
                "If you did not initiate this sign-up request, please disregard this message.\n\n" +
                "Best regards,\n" +
                "The SignEase Team";

        dispatchEmail(toEmail, subject, text, null);
    }

    @Async
    public void sendDocumentCompletedNotification(Document document) {
        String downloadUrl = baseUrl + "/documents/" + document.getId() + "/download";
        String verifyUrl = baseUrl + "/verify?hash=" + document.getFinalHash();

        log.info("--------------------------------------------------");
        log.info(">>> DOCUMENT COMPLETED & SEALED: {}", document.getTitle());
        log.info(">>> Final SHA-256: {}", document.getFinalHash());
        log.info(">>> Download URL: {}", downloadUrl);
        log.info(">>> Public Verification URL: {}", verifyUrl);
        log.info("--------------------------------------------------");

        try {
            Context context = new Context();
            context.setVariable("documentTitle", document.getTitle());
            context.setVariable("ownerName", document.getUploadedBy().getFullName());
            context.setVariable("downloadUrl", downloadUrl);
            context.setVariable("verifyUrl", verifyUrl);
            context.setVariable("finalHash", document.getFinalHash());

            String html = templateEngine.process("email/signed-notification", context);
            String plainText = "The document \"" + document.getTitle() + "\" has been signed and sealed.\nVerify at: " + verifyUrl;

            dispatchEmail(document.getUploadedBy().getEmail(), "Document Completed: " + document.getTitle(), plainText, html);
        } catch (Exception e) {
            log.warn("Could not dispatch completion email: {}", e.getMessage());
        }
    }
}
