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
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.nio.charset.StandardCharsets;

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
    public String listDocuments() {
        return "redirect:/#/documents";
    }

    @GetMapping("/upload")
    public String uploadPage() {
        return "redirect:/#/upload";
    }

    @GetMapping("/{id}")
    public String viewDocument(@PathVariable("id") UUID id) {
        return "redirect:/#/documents/" + id;
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

        String asciiFilename = filename.replaceAll("[^\\x20-\\x7E]", "_");
        ContentDisposition disposition = ContentDisposition.attachment()
                .filename(asciiFilename, StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
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

