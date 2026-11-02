package com.esign.platform.controller;

import com.esign.platform.dto.CreateSigningRequestDto;
import com.esign.platform.dto.DocumentUploadDto;
import com.esign.platform.model.AuditLog;
import com.esign.platform.model.Document;
import com.esign.platform.model.DocumentField;
import com.esign.platform.model.Signature;
import com.esign.platform.model.SignerInvite;
import com.esign.platform.model.SigningRequest;
import com.esign.platform.model.User;
import com.esign.platform.repository.DocumentFieldRepository;
import com.esign.platform.repository.DocumentRepository;
import com.esign.platform.repository.SignatureRepository;
import com.esign.platform.repository.SignerInviteRepository;
import com.esign.platform.repository.SigningRequestRepository;
import com.esign.platform.service.AuditService;
import com.esign.platform.service.AuthService;
import com.esign.platform.service.DocumentService;
import com.esign.platform.service.SigningService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApiDocumentController {

    private final DocumentService documentService;
    private final SigningService signingService;
    private final AuthService authService;
    private final DocumentRepository documentRepository;
    private final SigningRequestRepository signingRequestRepository;
    private final SignerInviteRepository signerInviteRepository;
    private final SignatureRepository signatureRepository;
    private final DocumentFieldRepository fieldRepository;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<?> listDocuments(@RequestParam(value = "status", required = false) String status) {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Unauthorized"));

        List<Document> docs = (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status))
                ? documentRepository.findByUploadedByOrderByCreatedAtDesc(user).stream()
                    .filter(d -> d.getStatus().name().equalsIgnoreCase(status)).toList()
                : documentRepository.findByUploadedByOrderByCreatedAtDesc(user);

        return ResponseEntity.ok(docs.stream().map(d -> Map.of(
                "id", d.getId(),
                "title", d.getTitle(),
                "fileName", d.getFileName(),
                "status", d.getStatus().name(),
                "fileSize", d.getFileSize() != null ? d.getFileSize() : 0,
                "pageCount", d.getPageCount(),
                "createdAt", d.getCreatedAt(),
                "originalHash", d.getOriginalHash() != null ? d.getOriginalHash() : "",
                "finalHash", d.getFinalHash() != null ? d.getFinalHash() : ""
        )).toList());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(@RequestParam("title") String title,
                                            @RequestParam(value = "description", required = false) String description,
                                            @RequestParam(value = "file", required = false) MultipartFile file,
                                            @RequestParam(value = "sequentialSigning", defaultValue = "false") boolean sequential,
                                            HttpServletRequest request) throws Exception {

        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Unauthorized"));

        DocumentUploadDto dto = new DocumentUploadDto();
        dto.setTitle(title);
        dto.setDescription(description);
        dto.setFile(file);
        dto.setSequentialSigning(sequential);

        Document doc = documentService.uploadDocument(dto, user, request.getRemoteAddr(), request.getHeader("User-Agent"));

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", doc.getId());
        resp.put("title", doc.getTitle());
        resp.put("status", doc.getStatus());
        resp.put("originalHash", doc.getOriginalHash());
        resp.put("pages", doc.getPageCount());

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocumentDetails(@PathVariable("id") UUID id) {
        Document doc = documentService.getDocumentById(id);
        Optional<SigningRequest> reqOpt = signingRequestRepository.findByDocument(doc);

        List<SignerInvite> signers = reqOpt.isPresent()
                ? signerInviteRepository.findBySigningRequestOrderBySignOrderAsc(reqOpt.get())
                : List.of();

        List<Signature> signatures = signatureRepository.findByDocument(doc);
        List<DocumentField> fields = fieldRepository.findByDocumentOrderByPageNumberAsc(doc);
        List<AuditLog> auditLogs = auditService.getDocumentAuditLogs(doc.getId());

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", doc.getId());
        resp.put("title", doc.getTitle());
        resp.put("description", doc.getDescription());
        resp.put("fileName", doc.getFileName());
        resp.put("status", doc.getStatus().name());
        resp.put("pageCount", doc.getPageCount());
        resp.put("fileSize", doc.getFileSize());
        resp.put("originalHash", doc.getOriginalHash());
        resp.put("finalHash", doc.getFinalHash());
        resp.put("sequentialSigning", doc.getSequentialSigning());
        resp.put("createdAt", doc.getCreatedAt());
        resp.put("completedAt", doc.getCompletedAt());
        resp.put("ownerName", doc.getUploadedBy().getFullName());
        resp.put("ownerEmail", doc.getUploadedBy().getEmail());

        resp.put("signers", signers.stream().map(s -> Map.of(
                "id", s.getId(),
                "name", s.getSignerName(),
                "email", s.getSignerEmail(),
                "phone", s.getPhone() != null ? s.getPhone() : "",
                "status", s.getStatus().name(),
                "signOrder", s.getSignOrder(),
                "otpVerified", s.getOtpVerified(),
                "signingToken", s.getSigningToken(),
                "signedAt", s.getSignedAt() != null ? s.getSignedAt().toString() : ""
        )).toList());

        resp.put("auditLogs", auditLogs.stream().map(a -> Map.of(
                "action", a.getAction(),
                "details", a.getDetails() != null ? a.getDetails() : "",
                "timestamp", a.getTimestamp(),
                "ipAddress", a.getIpAddress() != null ? a.getIpAddress() : "",
                "prevHash", a.getPrevHash() != null ? a.getPrevHash() : "",
                "currentHash", a.getCurrentHash() != null ? a.getCurrentHash() : ""
        )).toList());

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<?> sendDocument(@PathVariable("id") UUID id,
                                          @RequestBody CreateSigningRequestDto dto,
                                          HttpServletRequest request) {

        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Unauthorized"));

        dto.setDocumentId(id);
        SigningRequest signingRequest = signingService.createSigningRequest(
                dto, user, request.getRemoteAddr(), request.getHeader("User-Agent")
        );

        Map<String, Object> resp = new HashMap<>();
        resp.put("requestId", signingRequest.getId());
        resp.put("documentId", id);
        resp.put("status", signingRequest.getStatus());
        resp.put("signersCount", signingRequest.getSignerInvites().size());

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelDocument(@PathVariable("id") UUID id,
                                            HttpServletRequest request) {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Unauthorized"));

        documentService.cancelDocument(id, user, request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Document cancelled successfully."));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable("id") UUID id,
                                                     @RequestParam(value = "sealed", defaultValue = "true") boolean preferSealed) {
        Document doc = documentService.getDocumentById(id);
        Resource resource = documentService.getDocumentResource(doc, preferSealed);

        String rawFilename = (preferSealed && doc.isSealed())
                ? "SEALED_" + doc.getFileName()
                : doc.getFileName();

        // Sanitize ASCII fallback and build RFC-5987 compliant Content-Disposition
        String asciiFilename = rawFilename.replaceAll("[^\\x20-\\x7E]", "_");
        ContentDisposition disposition = ContentDisposition.attachment()
                .filename(asciiFilename, StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(resource);
    }
}
