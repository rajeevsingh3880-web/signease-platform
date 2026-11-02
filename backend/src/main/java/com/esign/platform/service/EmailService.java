package com.esign.platform.service;

import com.esign.platform.model.Document;
import com.esign.platform.model.SignerInvite;
import com.esign.platform.model.SigningRequest;
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

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Value("${spring.mail.username:noreply@esignplatform.com}")
    private String fromEmail;

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
        log.info(">>> Signing URL: {}", signingUrl);
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

            // Clean plain-text alternative
            String plainText = "Hello " + signerName + ",\n\n" +
                    senderName + " has requested your electronic signature on the document: \"" + documentTitle + "\".\n\n" +
                    (inviteMessage != null && !inviteMessage.isBlank() ? "Message: " + inviteMessage + "\n\n" : "") +
                    "To review and sign this agreement, please open the following link in your browser:\n" +
                    signingUrl + "\n\n" +
                    "This link is unique to you and does not require an account.\n\n" +
                    "Best regards,\n" +
                    "The SignEase Team";

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(signerEmail);
            helper.setSubject("Signature Requested: " + documentTitle);
            helper.setText(plainText, html);

            mailSender.send(mimeMessage);
            log.info("Email invite sent successfully to {}", signerEmail);
        } catch (Exception e) {
            log.error("Could not dispatch SMTP email to {}: {}", signerEmail, e.getMessage(), e);
        }
    }

    @Async
    public void sendOtpCode(SignerInvite signer, String otpCode) {
        log.info("==================================================");
        log.info(">>> SIGNER OTP VERIFICATION CODE: [{}] for {}", otpCode, signer.getSignerEmail());
        log.info("==================================================");

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(signer.getSignerEmail());
            helper.setSubject("Your One-Time Passcode (OTP) for Document Signing");
            helper.setText("Your OTP verification code is: " + otpCode + ". This code expires in 10 minutes.", false);

            mailSender.send(mimeMessage);
            log.info("OTP email sent successfully to {}", signer.getSignerEmail());
        } catch (Exception e) {
            log.warn("Could not dispatch OTP email (logged above): {}", e.getMessage());
        }
    }

    @Async
    public void sendAadhaarOtpCode(SignerInvite signer, String otpCode, String maskedAadhaar) {
        log.info("==================================================");
        log.info(">>> AADHAAR e-KYC OTP CODE: [{}] for Aadhaar [{}] ({})", otpCode, maskedAadhaar, signer.getSignerEmail());
        log.info("==================================================");

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(signer.getSignerEmail());
            helper.setSubject("UIDAI Aadhaar Authentication OTP for Document Signing");
            helper.setText("Dear " + signer.getSignerName() + ",\n\n" +
                    "Your One-Time Password (OTP) for Aadhaar eSign identity authentication (Aadhaar: " + maskedAadhaar + ") is: " + otpCode + ".\n\n" +
                    "This OTP is valid for 10 minutes. Under Section 3A of the Information Technology Act, 2000, this OTP authorizes the electronic signature of the requested document.\n\n" +
                    "Do not share this OTP with anyone for your security.", false);

            mailSender.send(mimeMessage);
            log.info("Aadhaar OTP email sent successfully to {}", signer.getSignerEmail());
        } catch (Exception e) {
            log.warn("Could not dispatch Aadhaar OTP email (logged above): {}", e.getMessage());
        }
    }

    @Async
    public void sendRegistrationOtpCode(String toEmail, String otpCode) {
        log.info("==================================================");
        log.info(">>> REGISTRATION EMAIL AUTHENTICATION OTP: [{}] for {}", otpCode, toEmail);
        log.info("==================================================");

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify Your Email Address - SignEase Platform");
            helper.setText("Welcome to SignEase!\n\n" +
                    "To verify that your email address is authentic and complete your account setup, please enter the following One-Time Passcode (OTP):\n\n" +
                    "Verification OTP: " + otpCode + "\n\n" +
                    "This code is valid for 10 minutes.\n\n" +
                    "If you did not initiate this sign-up request, please disregard this message.\n\n" +
                    "Best regards,\n" +
                    "The SignEase Team", false);

            mailSender.send(mimeMessage);
            log.info("Registration OTP email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.warn("Could not dispatch registration OTP email (logged above): {}", e.getMessage());
        }
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

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(document.getUploadedBy().getEmail());
            helper.setSubject("Document Completed: " + document.getTitle());
            helper.setText(html, true);

            mailSender.send(mimeMessage);
            log.info("Completion email sent successfully to {}", document.getUploadedBy().getEmail());
        } catch (Exception e) {
            log.warn("Could not dispatch completion email: {}", e.getMessage());
        }
    }
}

