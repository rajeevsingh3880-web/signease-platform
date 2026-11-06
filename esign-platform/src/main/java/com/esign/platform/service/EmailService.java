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
     * 1. If Brevo API key is configured, uses Brevo HTTPS API (Port 443 - zero firewall blocks, sends to ANY email)
     * 2. If Resend API key is configured, uses Resend HTTPS API (Port 443)
     * 3. Falls back to Spring JavaMailSender (SMTP Port 587/465) for local dev or unblocked servers
     */
    public boolean dispatchEmail(String toEmail, String subject, String plainText, String html) {
        if (toEmail == null || toEmail.isBlank()) {
            log.warn("Cannot dispatch email: recipient email is null or empty");
            return false;
        }
        String cleanEmail = toEmail.trim();

        // Option 1: Brevo HTTPS API (Prioritized! Supports all recipients without domain restrictions)
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            boolean sent = sendViaBrevo(cleanEmail, subject, html, plainText);
            if (sent) return true;
            log.warn("Brevo dispatch failed for {}, falling back to next provider...", cleanEmail);
        }

        // Option 2: Resend HTTPS API (if configured)
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            boolean sent = sendViaResend(cleanEmail, subject, html, plainText);
            if (sent) return true;
            log.warn("Resend dispatch failed for {}, falling back to SMTP...", cleanEmail);
        }

        // Option 3: Standard Gmail SMTP (port 587 - default for localhost)
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            boolean isHtml = (html != null && !html.isBlank());
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, isHtml, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(cleanEmail);
            helper.setSubject(subject);
            if (isHtml) {
                helper.setText(plainText != null ? plainText : "", html);
            } else {
                helper.setText(plainText != null ? plainText : "", false);
            }

            mailSender.send(mimeMessage);
            log.info("Email successfully dispatched via Gmail SMTP to {}", cleanEmail);
            return true;
        } catch (Exception e) {
            log.warn("Gmail SMTP dispatch failed for {}: {}", cleanEmail, e.getMessage());
        }

        return false;
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
            payload.put("sender", Map.of("name", "SignEase", "email", senderEmail.trim()));
            payload.put("to", List.of(Map.of("email", toEmail.trim())));
            payload.put("subject", subject);
            if (html != null && !html.isBlank()) {
                payload.put("htmlContent", html);
            }
            if (plainText != null && !plainText.isBlank()) {
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
        String signerEmail = (signer != null && signer.getSignerEmail() != null) ? signer.getSignerEmail().trim() : "";
        if (signerEmail.isBlank()) {
            log.warn("Cannot dispatch signing invite: signer email is empty.");
            return;
        }

        String signerName = (signer != null && signer.getSignerName() != null && !signer.getSignerName().isBlank())
                ? signer.getSignerName().trim() : signerEmail;
        String senderName = (request != null && request.getRequestedBy() != null && request.getRequestedBy().getFullName() != null)
                ? request.getRequestedBy().getFullName().trim() : "Document Requester";
        String documentTitle = (request != null && request.getDocument() != null && request.getDocument().getTitle() != null)
                ? request.getDocument().getTitle().trim() : (request != null && request.getTitle() != null ? request.getTitle().trim() : "Agreement");
        String inviteMessage = (request != null && request.getMessage() != null) ? request.getMessage().trim() : "";
        boolean hasMessage = !inviteMessage.isEmpty();

        UUID token = signer != null ? signer.getSigningToken() : UUID.randomUUID();
        java.time.LocalDateTime expiryDate = (signer != null && signer.getTokenExpiry() != null)
                ? signer.getTokenExpiry() : java.time.LocalDateTime.now().plusDays(30);

        String activeBaseUrl = (baseUrl != null && !baseUrl.isBlank() && !baseUrl.contains("localhost"))
                ? baseUrl : "https://signease-platform.onrender.com";
        String signingUrl = activeBaseUrl + "/sign/" + token;
        String spaUrl = activeBaseUrl + "/#/sign/" + token;

        log.info("--------------------------------------------------");
        log.info(">>> DISPATCHING SIGNING INVITE FOR: {}", signerEmail);
        log.info(">>> Document: {}", documentTitle);
        log.info(">>> Sender: {}", senderName);
        log.info(">>> Direct Signing URL: {}", signingUrl);
        log.info(">>> SPA Signing URL: {}", spaUrl);
        log.info("--------------------------------------------------");

        String html = null;
        try {
            Context context = new Context();
            context.setVariable("signerName", signerName);
            context.setVariable("senderName", senderName);
            context.setVariable("documentTitle", documentTitle);
            context.setVariable("message", inviteMessage);
            context.setVariable("hasMessage", hasMessage);
            context.setVariable("signingUrl", signingUrl);
            context.setVariable("spaUrl", spaUrl);
            context.setVariable("hasSpaUrl", true);
            context.setVariable("expiryDate", expiryDate);

            html = templateEngine.process("email/signing-request", context);
        } catch (Exception e) {
            log.warn("Thymeleaf template rendering failed for signing invite: {}. Using generated inline HTML fallback.", e.getMessage());
            html = "<div style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;padding:24px;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;'>" +
                    "<div style='background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#ffffff;padding:20px;text-align:center;border-radius:8px 8px 0 0;'><h2 style='margin:0;'>SignEase Document Execution</h2></div>" +
                    "<div style='padding:24px;'>" +
                    "<p>Hello <strong>" + signerName + "</strong>,</p>" +
                    "<p><strong>" + senderName + "</strong> has requested your electronic signature on <strong>" + documentTitle + "</strong>.</p>" +
                    (hasMessage ? "<p style='padding:12px;background:#f1f5f9;border-left:4px solid #3b82f6;'><em>" + inviteMessage + "</em></p>" : "") +
                    "<div style='text-align:center;margin:30px 0;'>" +
                    "<a href='" + spaUrl + "' style='background:#2563eb;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;'>✍️ Click Here to Review &amp; Sign</a>" +
                    "</div>" +
                    "<p style='font-size:13px;color:#64748b;'>Direct Link: <a href='" + spaUrl + "'>" + spaUrl + "</a></p>" +
                    "</div></div>";
        }

        String plainText = "Hello " + signerName + ",\n\n" +
                senderName + " has requested your electronic signature on the document: \"" + documentTitle + "\".\n\n" +
                (hasMessage ? "Message: " + inviteMessage + "\n\n" : "") +
                "To review and sign this agreement, please open either link below in your browser:\n\n" +
                "👉 Review & Sign Link: " + spaUrl + "\n" +
                "👉 Direct Portal: " + signingUrl + "\n\n" +
                "This link is unique to you and does not require an account.\n\n" +
                "Best regards,\n" +
                "The SignEase Team";

        boolean dispatched = dispatchEmail(signerEmail, "Action Required: Please sign " + documentTitle, plainText, html);
        if (!dispatched) {
            log.error("Failed to dispatch signing invite to {}", signerEmail);
        } else {
            log.info("Successfully dispatched signing invite to {}", signerEmail);
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
