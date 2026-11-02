package com.esign.platform.controller;

import com.esign.platform.dto.AadhaarOtpRequestDto;
import com.esign.platform.dto.AadhaarVerifyRequestDto;
import com.esign.platform.dto.CreateSigningRequestDto;
import com.esign.platform.dto.OtpVerificationDto;
import com.esign.platform.dto.SubmitSignatureDto;
import com.esign.platform.model.Document;
import com.esign.platform.model.DocumentField;
import com.esign.platform.model.SignerInvite;
import com.esign.platform.model.SigningRequest;
import com.esign.platform.model.User;
import com.esign.platform.repository.DocumentFieldRepository;
import com.esign.platform.service.AuthService;
import com.esign.platform.service.DocumentService;
import com.esign.platform.service.SigningService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/signing")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ApiSigningController {

    private final SigningService signingService;
    private final DocumentService documentService;
    private final AuthService authService;
    private final DocumentFieldRepository fieldRepository;

    @Value("${app.security.expose-test-otp:true}")
    private boolean exposeTestOtp;

    @PostMapping("/requests")
    public ResponseEntity<?> createSigningRequest(@RequestBody CreateSigningRequestDto dto,
                                                  HttpServletRequest request) {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Unauthorized. Please provide valid Bearer token."));

        SigningRequest signingRequest = signingService.createSigningRequest(
                dto, user, request.getRemoteAddr(), request.getHeader("User-Agent")
        );

        List<Map<String, Object>> signersList = signingRequest.getSignerInvites().stream()
                .map(inv -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", inv.getId());
                    m.put("name", inv.getSignerName());
                    m.put("email", inv.getSignerEmail());
                    m.put("token", inv.getSigningToken());
                    return m;
                }).toList();

        Map<String, Object> resp = new HashMap<>();
        resp.put("requestId", signingRequest.getId());
        resp.put("documentId", dto.getDocumentId());
        resp.put("status", signingRequest.getStatus());
        resp.put("signersCount", signingRequest.getSignerInvites().size());
        resp.put("signers", signersList);
        resp.put("message", "Signing request created and invites dispatched successfully.");

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/invites/{id}/resend")
    public ResponseEntity<?> resendInvite(@PathVariable("id") UUID inviteId,
                                          HttpServletRequest request) {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Unauthorized. Please provide valid Bearer token."));

        signingService.resendSigningInvite(inviteId, user, request.getRemoteAddr(), request.getHeader("User-Agent"));

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Signing invitation email has been resent successfully!");
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/context/{token}")
    public ResponseEntity<?> getSigningContext(@PathVariable("token") UUID token,
                                               HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            SignerInvite invite = signingService.accessSigningPage(token, ip, userAgent);
            Document doc = invite.getSigningRequest().getDocument();
            List<DocumentField> fields = fieldRepository.findBySignerInvite(invite);

            Map<String, Object> resp = new HashMap<>();
            resp.put("token", invite.getSigningToken());
            resp.put("signerName", invite.getSignerName());
            resp.put("signerEmail", invite.getSignerEmail());
            resp.put("signerPhone", invite.getPhone());
            resp.put("signerStatus", invite.getStatus());
            resp.put("otpVerified", invite.getOtpVerified());
            resp.put("aadhaarVerified", invite.getAadhaarVerified());
            resp.put("aadhaarNumber", invite.getAadhaarNumber());
            resp.put("tokenExpiry", invite.getTokenExpiry());
            resp.put("signedAt", invite.getSignedAt());

            resp.put("documentId", doc.getId());
            resp.put("documentTitle", doc.getTitle());
            resp.put("documentFileName", doc.getFileName());
            resp.put("pageCount", doc.getPageCount());
            resp.put("senderName", doc.getUploadedBy().getFullName());
            resp.put("senderEmail", doc.getUploadedBy().getEmail());
            resp.put("organizationName", doc.getOrganization() != null ? doc.getOrganization().getName() : "Enterprise");
            resp.put("originalHash", doc.getOriginalHash());
            resp.put("finalHash", doc.getFinalHash());

            resp.put("fields", fields.stream().map(f -> Map.of(
                    "id", f.getId(),
                    "type", f.getFieldType(),
                    "page", f.getPageNumber(),
                    "x", f.getPosX(),
                    "y", f.getPosY(),
                    "width", f.getWidth(),
                    "height", f.getHeight()
            )).toList());

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/otp/{token}")
    public ResponseEntity<?> requestOtp(@PathVariable("token") UUID token,
                                        HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            String otp = signingService.generateAndSendOtp(token, ip, userAgent);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "A 6-digit OTP code has been sent to your email.");
            if (exposeTestOtp) {
                resp.put("testOtp", otp); // Convenient for rapid dev testing
            }
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp/{token}")
    public ResponseEntity<?> verifyOtp(@PathVariable("token") UUID token,
                                       @RequestBody OtpVerificationDto otpDto,
                                       HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            boolean valid = signingService.verifyOtp(token, otpDto.getOtpCode(), ip, userAgent);

            if (valid) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Identity verified successfully!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid or expired OTP code"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/aadhaar-otp/{token}")
    public ResponseEntity<?> requestAadhaarOtp(@PathVariable("token") UUID token,
                                               @RequestBody AadhaarOtpRequestDto dto,
                                               HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            String otp = signingService.generateAndSendAadhaarOtp(token, dto.getAadhaarNumber(), ip, userAgent);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "Aadhaar OTP dispatched to linked mobile & email.");
            if (exposeTestOtp) {
                resp.put("testOtp", otp);
            }
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/verify-aadhaar-otp/{token}")
    public ResponseEntity<?> verifyAadhaarOtp(@PathVariable("token") UUID token,
                                              @RequestBody AadhaarVerifyRequestDto dto,
                                              HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            var result = signingService.verifyAadhaarOtp(token, dto.getAadhaarNumber(), dto.getOtpCode(), ip, userAgent);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/submit/{token}")
    public ResponseEntity<?> submitSignature(@PathVariable("token") UUID token,
                                             @RequestBody SubmitSignatureDto submitDto,
                                             HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            var signature = signingService.submitSignature(token, submitDto, ip, userAgent);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Signature recorded and legally executed under IT Act 2000 (Section 10A)",
                    "signatureId", signature.getId(),
                    "signedAt", signature.getSignedAt(),
                    "legalBasis", signature.getLegalBasis()
            ));
        } catch (Exception e) {
            log.error("Failed to submit signature", e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/decline/{token}")
    public ResponseEntity<?> declineDocument(@PathVariable("token") UUID token,
                                             @RequestBody(required = false) Map<String, String> body,
                                             HttpServletRequest request) {
        try {
            String reason = body != null ? body.getOrDefault("reason", "Declined by signer") : "Declined by signer";
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            signingService.declineSignature(token, reason, ip, userAgent);

            return ResponseEntity.ok(Map.of("success", true, "message", "Document execution declined."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/preview/{token}")
    public ResponseEntity<Resource> previewDocumentForSigning(@PathVariable("token") UUID token) {
        SignerInvite invite = signingService.accessSigningPage(token, "127.0.0.1", "Browser");
        Document doc = invite.getSigningRequest().getDocument();
        Resource resource = documentService.getDocumentResource(doc, false);

        String asciiFilename = doc.getFileName().replaceAll("[^\\x20-\\x7E]", "_");
        ContentDisposition disposition = ContentDisposition.inline()
                .filename(asciiFilename, StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(resource);
    }
}

