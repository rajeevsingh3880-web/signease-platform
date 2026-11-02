package com.esign.platform.controller;

import com.esign.platform.dto.DocumentUploadDto;
import com.esign.platform.model.*;
import com.esign.platform.repository.DocumentFieldRepository;
import com.esign.platform.repository.SignatureRepository;
import com.esign.platform.repository.SignerInviteRepository;
import com.esign.platform.repository.SigningRequestRepository;
import com.esign.platform.service.AuditService;
import com.esign.platform.service.AuthService;
import com.esign.platform.service.DocumentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping("/documents")
@RequiredArgsConstructor
@Slf4j
public class DocumentController {

    private final DocumentService documentService;
    private final AuthService authService;
    private final SigningRequestRepository requestRepository;
    private final SignerInviteRepository signerInviteRepository;
    private final SignatureRepository signatureRepository;
    private final DocumentFieldRepository fieldRepository;
    private final AuditService auditService;

    @GetMapping
    public String listDocuments(@RequestParam(value = "status", required = false) String statusStr,
                                @RequestParam(value = "query", required = false) String query,
                                @RequestParam(value = "page", defaultValue = "0") int page,
                                @RequestParam(value = "size", defaultValue = "10") int size,
                                Model model) {

        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Document> documents;

        if (statusStr != null && !statusStr.isBlank() && !"ALL".equalsIgnoreCase(statusStr)) {
            try {
                Document.Status status = Document.Status.valueOf(statusStr.toUpperCase());
                documents = documentService.getUserDocumentsByStatus(user, status, pageRequest);
            } catch (IllegalArgumentException e) {
                documents = documentService.getUserDocuments(user, pageRequest);
            }
        } else {
            documents = documentService.getUserDocuments(user, pageRequest);
        }

        model.addAttribute("user", user);
        model.addAttribute("documents", documents);
        model.addAttribute("currentStatus", statusStr != null ? statusStr : "ALL");
        model.addAttribute("searchQuery", query);

        return "documents/list";
    }

    @GetMapping("/upload")
    public String uploadPage(Model model) {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));
        model.addAttribute("user", user);
        model.addAttribute("uploadDto", new DocumentUploadDto());
        return "documents/upload";
    }

    @PostMapping("/upload")
    public String handleUpload(@ModelAttribute("uploadDto") DocumentUploadDto uploadDto,
                               HttpServletRequest request,
                               RedirectAttributes redirectAttributes) {

        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));

        try {
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            Document doc = documentService.uploadDocument(uploadDto, user, ip, userAgent);

            redirectAttributes.addFlashAttribute("successMessage",
                    "Document \"" + doc.getTitle() + "\" uploaded successfully! You can now configure signers.");
            return "redirect:/signing/request?documentId=" + doc.getId();
        } catch (Exception e) {
            log.error("Upload failed", e);
            redirectAttributes.addFlashAttribute("errorMessage", "Upload failed: " + e.getMessage());
            return "redirect:/documents/upload";
        }
    }

    @GetMapping("/{id}")
    public String viewDocument(@PathVariable("id") UUID id, Model model) {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));

        Document document = documentService.getDocumentById(id);
        Optional<SigningRequest> signingRequest = requestRepository.findByDocument(document);

        List<SignerInvite> signers = signingRequest.isPresent()
                ? signerInviteRepository.findBySigningRequestOrderBySignOrderAsc(signingRequest.get())
                : List.of();

        List<Signature> signatures = signatureRepository.findByDocument(document);
        List<DocumentField> fields = fieldRepository.findByDocumentOrderByPageNumberAsc(document);
        List<AuditLog> auditLogs = auditService.getDocumentAuditLogs(document.getId());

        model.addAttribute("user", user);
        model.addAttribute("document", document);
        model.addAttribute("signingRequest", signingRequest.orElse(null));
        model.addAttribute("signers", signers);
        model.addAttribute("signatures", signatures);
        model.addAttribute("fields", fields);
        model.addAttribute("auditLogs", auditLogs);

        return "documents/view";
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable("id") UUID id,
                                                     @RequestParam(value = "sealed", defaultValue = "true") boolean preferSealed,
                                                     HttpServletRequest request) {

        Document doc = documentService.getDocumentById(id);
        Resource resource = documentService.getDocumentResource(doc, preferSealed);

        String filename = (preferSealed && doc.isSealed())
                ? "SEALED_" + doc.getFileName()
                : doc.getFileName();

        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        auditService.logAction(
                doc,
                null,
                authService.getCurrentUser().orElse(null),
                "document.downloaded",
                "DOCUMENT",
                doc.getId().toString(),
                "Document downloaded: " + filename,
                ip,
                userAgent
        );

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @PostMapping("/{id}/cancel")
    public String cancelDocument(@PathVariable("id") UUID id,
                                 HttpServletRequest request,
                                 RedirectAttributes redirectAttributes) {

        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));

        try {
            documentService.cancelDocument(id, user, request.getRemoteAddr(), request.getHeader("User-Agent"));
            redirectAttributes.addFlashAttribute("successMessage", "Document cancelled successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/documents/" + id;
    }
}

