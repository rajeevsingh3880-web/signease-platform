package com.esign.platform.controller;

import com.esign.platform.dto.AadhaarOtpRequestDto;
import com.esign.platform.dto.AadhaarVerifyRequestDto;
import com.esign.platform.dto.CreateSigningRequestDto;
import com.esign.platform.dto.OtpVerificationDto;
import com.esign.platform.dto.SubmitSignatureDto;
import com.esign.platform.model.Document;
import com.esign.platform.model.DocumentField;
import com.esign.platform.model.SignerInvite;
import com.esign.platform.model.User;
import com.esign.platform.repository.DocumentFieldRepository;
import com.esign.platform.repository.DocumentRepository;
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
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.nio.charset.StandardCharsets;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class SigningController {

    private final SigningService signingService;
    private final DocumentService documentService;
    private final AuthService authService;
    private final DocumentRepository documentRepository;
    private final DocumentFieldRepository fieldRepository;

    @Value("${app.security.expose-test-otp:true}")
    private boolean exposeTestOtp;

    @GetMapping("/signing/request")
    public String signingRequestPage(@RequestParam(value = "documentId", required = false) UUID documentId,
                                     Model model) {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));

        List<Document> userDrafts = documentRepository.findByUploadedByOrderByCreatedAtDesc(user).stream()
                .filter(Document::isEditable)
                .toList();

        Document selectedDoc = null;
        if (documentId != null) {
            selectedDoc = documentService.getDocumentById(documentId);
        } else if (!userDrafts.isEmpty()) {
            selectedDoc = userDrafts.get(0);
        }

        model.addAttribute("user", user);
        model.addAttribute("draftDocuments", userDrafts);
        model.addAttribute("selectedDocument", selectedDoc);
        model.addAttribute("requestDto", new CreateSigningRequestDto());

        return "signing/request";
    }

    @PostMapping("/signing/request")
    public String createSigningRequest(@ModelAttribute("requestDto") CreateSigningRequestDto requestDto,
                                       HttpServletRequest request,
                                       RedirectAttributes redirectAttributes) {

        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));

        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            signingService.createSigningRequest(requestDto, user, ip, userAgent);

            redirectAttributes.addFlashAttribute("successMessage",
                    "Signing request dispatched successfully! Signers have been notified.");
            return "redirect:/documents/" + requestDto.getDocumentId();
        } catch (Exception e) {
            log.error("Failed to create signing request", e);
            redirectAttributes.addFlashAttribute("errorMessage", "Error: " + e.getMessage());
            return "redirect:/signing/request?documentId=" + requestDto.getDocumentId();
        }
    }

    @GetMapping("/sign/{token}")
    public String signerPage(@PathVariable("token") UUID token,
                             HttpServletRequest request,
                             Model model) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            SignerInvite invite = signingService.accessSigningPage(token, ip, userAgent);
            Document document = invite.getSigningRequest().getDocument();

            List<DocumentField> fields = fieldRepository.findBySignerInvite(invite);

            model.addAttribute("invite", invite);
            model.addAttribute("document", document);
            model.addAttribute("fields", fields);
            model.addAttribute("submitDto", new SubmitSignatureDto());

            if (invite.getStatus() == SignerInvite.Status.SIGNED) {
                return "signing/completed";
            }
            if (invite.getStatus() == SignerInvite.Status.DECLINED) {
                model.addAttribute("reason", invite.getDeclineReason());
                return "signing/declined";
            }

            return "signing/sign";
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "signing/invalid-token";
        }
    }

    @PostMapping("/sign/{token}/otp")
    @ResponseBody
    public ResponseEntity<?> requestOtp(@PathVariable("token") UUID token,
                                        HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            String otp = signingService.generateAndSendOtp(token, ip, userAgent);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "A 6-digit OTP has been sent to your email.");
            if (exposeTestOtp) {
                resp.put("testOtp", otp); // Provided for quick browser testing
            }
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/sign/{token}/verify-otp")
    @ResponseBody
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
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/sign/{token}/aadhaar-otp")
    @ResponseBody
    public ResponseEntity<?> requestAadhaarOtp(@PathVariable("token") UUID token,
                                               @RequestBody(required = false) AadhaarOtpRequestDto dto,
                                               @RequestParam(value = "aadhaarNumber", required = false) String paramAadhaar,
                                               HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            String aadhaar = (dto != null && dto.getAadhaarNumber() != null) ? dto.getAadhaarNumber() : paramAadhaar;
            if (aadhaar == null || aadhaar.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Aadhaar number is required"));
            }

            String otp = signingService.generateAndSendAadhaarOtp(token, aadhaar, ip, userAgent);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "Aadhaar authentication OTP sent to mobile registered with Aadhaar (and your email).");
            if (exposeTestOtp) {
                resp.put("testOtp", otp);
            }
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/sign/{token}/verify-aadhaar-otp")
    @ResponseBody
    public ResponseEntity<?> verifyAadhaarOtp(@PathVariable("token") UUID token,
                                              @RequestBody(required = false) AadhaarVerifyRequestDto dto,
                                              HttpServletRequest request) {
        try {
            if (dto == null || dto.getAadhaarNumber() == null || dto.getOtpCode() == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Aadhaar number and OTP code are required"));
            }
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            Map<String, Object> result = signingService.verifyAadhaarOtp(token, dto.getAadhaarNumber(), dto.getOtpCode(), ip, userAgent);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/sign/{token}/submit")
    public String submitSignature(@PathVariable("token") UUID token,
                                  @ModelAttribute("submitDto") SubmitSignatureDto submitDto,
                                  HttpServletRequest request,
                                  RedirectAttributes redirectAttributes) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            signingService.submitSignature(token, submitDto, ip, userAgent);

            return "redirect:/sign/" + token + "/completed";
        } catch (Exception e) {
            log.error("Failed to submit signature: {}", e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("already signed")) {
                return "redirect:/sign/" + token + "/completed";
            }
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to complete signing: " + e.getMessage());
            return "redirect:/sign/" + token;
        }
    }

    @PostMapping("/sign/{token}/decline")
    public String declineDocument(@PathVariable("token") UUID token,
                                  @RequestParam(value = "reason", required = false) String reason,
                                  HttpServletRequest request,
                                  RedirectAttributes redirectAttributes) {
        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            signingService.declineSignature(token, reason != null ? reason : "Decline requested by signer", ip, userAgent);
            return "redirect:/sign/" + token;
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/sign/" + token;
        }
    }

    @GetMapping("/sign/{token}/completed")
    public String signingCompletedPage(@PathVariable("token") UUID token, Model model) {
        SignerInvite invite = signingService.accessSigningPage(token, "127.0.0.1", "Browser");
        model.addAttribute("invite", invite);
        model.addAttribute("document", invite.getSigningRequest().getDocument());
        return "signing/completed";
    }

    @GetMapping("/sign/{token}/preview")
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

