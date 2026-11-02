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
        String signingUrl = baseUrl + "/sign/" + signer.getSigningToken();
        log.info("--------------------------------------------------");
        log.info(">>> SIGNING INVITE FOR: {}", signer.getSignerEmail());
        log.info(">>> Document: {}", request.getDocument().getTitle());
        log.info(">>> Signing URL: {}", signingUrl);
        log.info("--------------------------------------------------");

        try {
            Context context = new Context();
            context.setVariable("signerName", signer.getSignerName());
            context.setVariable("senderName", request.getRequestedBy().getFullName());
            context.setVariable("documentTitle", request.getDocument().getTitle());
            context.setVariable("message", request.getMessage());
            context.setVariable("signingUrl", signingUrl);
            context.setVariable("expiryDate", signer.getTokenExpiry());

            String html = templateEngine.process("email/signing-request", context);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(signer.getSignerEmail());
            helper.setSubject("Signature Requested: " + request.getDocument().getTitle());
            helper.setText(html, true);

            mailSender.send(mimeMessage);
            log.info("Email sent successfully to {}", signer.getSignerEmail());
        } catch (Exception e) {
            log.warn("Could not dispatch SMTP email (using console fallback): {}", e.getMessage());
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
        } catch (Exception e) {
            log.warn("Could not dispatch OTP email (logged above): {}", e.getMessage());
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
        } catch (Exception e) {
            log.warn("Could not dispatch completion email: {}", e.getMessage());
        }
    }
}

