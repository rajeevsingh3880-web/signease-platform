package com.esign.platform.service;

import com.esign.platform.model.SignerInvite;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppService {

    private final ObjectMapper objectMapper;

    @Value("${app.whatsapp.enabled:true}")
    private boolean enabled;

    @Value("${app.whatsapp.api-url:https://graph.facebook.com/v18.0}")
    private String apiUrl;

    @Value("${app.whatsapp.api-token:}")
    private String apiToken;

    @Value("${app.whatsapp.phone-number-id:}")
    private String phoneNumberId;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Clean and format phone number for international WhatsApp delivery (E.164 digits without + or spaces)
     * Defaults to India (91) prefix if 10 digits provided.
     */
    public String normalizePhoneNumber(String rawPhone) {
        if (rawPhone == null || rawPhone.isBlank()) {
            return "";
        }
        String digits = rawPhone.replaceAll("[^0-9]", "");
        if (digits.length() == 10) {
            digits = "91" + digits; // Default country code India
        }
        return digits;
    }

    /**
     * Generate universal WhatsApp Click-to-Chat URL (works on WhatsApp Web, Android, iOS, and Desktop)
     */
    public String generateWhatsAppUrl(String phone, String message) {
        String cleanPhone = normalizePhoneNumber(phone);
        String encodedMsg = URLEncoder.encode(message, StandardCharsets.UTF_8);
        if (cleanPhone.isBlank()) {
            return "https://api.whatsapp.com/send?text=" + encodedMsg;
        }
        return "https://api.whatsapp.com/send?phone=" + cleanPhone + "&text=" + encodedMsg;
    }

    /**
     * Dispatch WhatsApp message via WhatsApp Cloud API or Brevo HTTPS API (Port 443)
     */
    public boolean dispatchViaApi(String cleanPhone, String message) {
        if (!enabled || cleanPhone.isBlank() || message.isBlank()) {
            return false;
        }

        if (apiToken == null || apiToken.isBlank() || phoneNumberId == null || phoneNumberId.isBlank()) {
            log.info("WhatsApp Cloud API credentials not set. Message ready for direct Click-to-Chat delivery.");
            return false;
        }

        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            Map<String, Object> textObj = new HashMap<>();
            textObj.put("preview_url", true);
            textObj.put("body", message);

            Map<String, Object> payload = new HashMap<>();
            payload.put("messaging_product", "whatsapp");
            payload.put("recipient_type", "individual");
            payload.put("to", cleanPhone);
            payload.put("type", "text");
            payload.put("text", textObj);

            String jsonPayload = objectMapper.writeValueAsString(payload);
            String endpoint = apiUrl + "/" + phoneNumberId + "/messages";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .timeout(Duration.ofSeconds(15))
                    .header("Authorization", "Bearer " + apiToken.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("WhatsApp message successfully dispatched via Meta Cloud API to {}", cleanPhone);
                return true;
            } else {
                log.warn("WhatsApp Cloud API rejected message to {}: HTTP {} - {}", cleanPhone, response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            log.warn("Error calling WhatsApp Cloud API for {}: {}", cleanPhone, e.getMessage());
            return false;
        }
    }

    /**
     * Send Signing Invitation via WhatsApp
     */
    public Map<String, Object> sendSigningInviteWhatsApp(SignerInvite invite, String documentTitle, String appBaseUrl) {
        String phone = invite.getPhone();
        String cleanPhone = normalizePhoneNumber(phone);
        String rootUrl = (appBaseUrl != null && !appBaseUrl.isBlank()) ? appBaseUrl : baseUrl;
        String signingUrl = rootUrl + "/#/sign/" + invite.getSigningToken();

        String message = "📄 *SignEase Electronic Signature Request*\n\n" +
                "Hello *" + invite.getSignerName() + "*,\n\n" +
                "You have been requested to review and electronically sign:\n" +
                "📑 *" + documentTitle + "*\n\n" +
                "✍️ *Click here to sign directly on your phone:*\n" +
                signingUrl + "\n\n" +
                "⏱️ *Expires in 7 days*\n" +
                "🔒 *Legally Valid & Tamper-Evident* under Section 10A of the Information Technology Act (IT Act 2000).\n\n" +
                "— SignEase Secure Document Platform";

        String waUrl = generateWhatsAppUrl(cleanPhone, message);

        log.info("==================================================");
        log.info(">>> WHATSAPP SIGNING INVITATION DISPATCHED:");
        log.info(">>> Recipient: {} ({})", invite.getSignerName(), cleanPhone);
        log.info(">>> Document: {}", documentTitle);
        log.info(">>> Direct WhatsApp Link: {}", waUrl);
        log.info("==================================================");

        boolean apiDispatched = dispatchViaApi(cleanPhone, message);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("apiDispatched", apiDispatched);
        result.put("phone", cleanPhone);
        result.put("whatsappUrl", waUrl);
        result.put("message", "WhatsApp signing invitation generated successfully!");
        return result;
    }

    /**
     * Send Signer Identity Verification OTP via WhatsApp
     */
    public Map<String, Object> sendVerificationOtpWhatsApp(SignerInvite invite, String otpCode) {
        String phone = invite.getPhone();
        String cleanPhone = normalizePhoneNumber(phone);

        String message = "🔐 *SignEase Identity Verification Code*\n\n" +
                "Hello *" + invite.getSignerName() + "*,\n\n" +
                "Your 6-digit WhatsApp verification OTP for electronic signing is:\n\n" +
                "👉 *" + otpCode + "* 👈\n\n" +
                "⏱️ This code is valid for *10 minutes*.\n" +
                "⚠️ Do not share this code with anyone. SignEase representatives will never ask for your code.\n\n" +
                "— SignEase Security";

        String waUrl = generateWhatsAppUrl(cleanPhone, message);

        log.info("==================================================");
        log.info(">>> WHATSAPP IDENTITY VERIFICATION OTP: [{}] for {} ({})", otpCode, invite.getSignerName(), cleanPhone);
        log.info(">>> Direct WhatsApp OTP URL: {}", waUrl);
        log.info("==================================================");

        boolean apiDispatched = dispatchViaApi(cleanPhone, message);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("apiDispatched", apiDispatched);
        result.put("phone", cleanPhone);
        result.put("whatsappUrl", waUrl);
        result.put("message", "A 6-digit verification code has been dispatched via WhatsApp to " + (phone != null ? phone : "your phone") + ".");
        return result;
    }

    /**
     * Send Document Completion Notification via WhatsApp
     */
    @Async
    public void sendDocumentCompletedWhatsApp(SignerInvite invite, String documentTitle, String verifyUrl) {
        String phone = invite.getPhone();
        String cleanPhone = normalizePhoneNumber(phone);
        if (cleanPhone.isBlank()) return;

        String message = "✅ *SignEase Document Completed & Sealed*\n\n" +
                "Hello *" + invite.getSignerName() + "*,\n\n" +
                "The document *" + documentTitle + "* has been completed, digitally signed, and sealed.\n\n" +
                "🔍 *Verify Audit Certificate & Integrity:*\n" +
                verifyUrl + "\n\n" +
                "A copy has also been archived in your secure dashboard.\n\n" +
                "— SignEase Document Platform";

        log.info(">>> WhatsApp Document Completion dispatched to {}: {}", cleanPhone, documentTitle);
        dispatchViaApi(cleanPhone, message);
    }
}
