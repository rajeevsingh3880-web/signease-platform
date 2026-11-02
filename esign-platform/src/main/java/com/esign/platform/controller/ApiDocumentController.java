package com.esign.platform.controller;

import com.esign.platform.dto.CreateSigningRequestDto;
import com.esign.platform.dto.DocumentUploadDto;
import com.esign.platform.model.Document;
import com.esign.platform.model.SignerInvite;
import com.esign.platform.model.SigningRequest;
import com.esign.platform.model.User;
import com.esign.platform.repository.DocumentRepository;
import com.esign.platform.repository.SignerInviteRepository;
import com.esign.platform.repository.SigningRequestRepository;
import com.esign.platform.service.AuthService;
import com.esign.platform.service.DocumentService;
import com.esign.platform.service.SigningService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class ApiDocumentController {

    private final DocumentService documentService;
    private final SigningService signingService;
    private final AuthService authService;
    private final DocumentRepository documentRepository;
    private final SigningRequestRepository signingRequestRepository;
    private final SignerInviteRepository signerInviteRepository;

    @GetMapping
    public ResponseEntity<List<Document>> listDocuments() {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Unauthorized"));
        return ResponseEntity.ok(documentService.getUserDocuments(user));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(@RequestParam("title") String title,
                                            @RequestParam(value = "description", required = false) String description,
                                            @RequestParam(value = "file", required = false) MultipartFile file,
                                            HttpServletRequest request) throws Exception {

        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Unauthorized"));

        DocumentUploadDto dto = new DocumentUploadDto();
        dto.setTitle(title);
        dto.setDescription(description);
        dto.setFile(file);

        Document doc = documentService.uploadDocument(dto, user, request.getRemoteAddr(), request.getHeader("User-Agent"));

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", doc.getId());
        resp.put("title", doc.getTitle());
        resp.put("status", doc.getStatus());
        resp.put("originalHash", doc.getOriginalHash());
        resp.put("pages", doc.getPageCount());

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

    @GetMapping("/{id}/status")
    public ResponseEntity<?> getDocumentStatus(@PathVariable("id") UUID id) {
        Document document = documentService.getDocumentById(id);
        List<SigningRequest> requests = signingRequestRepository.findByDocument(document).stream().toList();

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", document.getId());
        resp.put("title", document.getTitle());
        resp.put("status", document.getStatus());
        resp.put("originalHash", document.getOriginalHash());
        resp.put("finalHash", document.getFinalHash());
        resp.put("completedAt", document.getCompletedAt());

        if (!requests.isEmpty()) {
            SigningRequest req = requests.get(0);
            List<SignerInvite> invites = signerInviteRepository.findBySigningRequestOrderBySignOrderAsc(req);
            resp.put("signers", invites.stream().map(i -> Map.of(
                    "name", i.getSignerName(),
                    "email", i.getSignerEmail(),
                    "status", i.getStatus(),
                    "otpVerified", i.getOtpVerified(),
                    "signedAt", i.getSignedAt() != null ? i.getSignedAt().toString() : "null"
            )).toList());
        }

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable("id") UUID id) {
        Document doc = documentService.getDocumentById(id);
        Resource resource = documentService.getDocumentResource(doc, true);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
    }
}

