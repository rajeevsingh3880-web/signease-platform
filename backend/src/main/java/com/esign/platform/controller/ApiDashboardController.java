package com.esign.platform.controller;

import com.esign.platform.model.Document;
import com.esign.platform.model.User;
import com.esign.platform.repository.AuditLogRepository;
import com.esign.platform.repository.DocumentRepository;
import com.esign.platform.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApiDashboardController {

    private final AuthService authService;
    private final DocumentRepository documentRepository;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Unauthorized"));

        long totalDocs = documentRepository.countByUploadedBy(user);
        long pendingDocs = documentRepository.countByUploadedByAndStatus(user, Document.Status.SENT)
                + documentRepository.countByUploadedByAndStatus(user, Document.Status.IN_PROGRESS);
        long completedDocs = documentRepository.countByUploadedByAndStatus(user, Document.Status.COMPLETED);
        long draftDocs = documentRepository.countByUploadedByAndStatus(user, Document.Status.DRAFT);

        Map<String, Object> resp = new HashMap<>();
        resp.put("totalDocuments", totalDocs);
        resp.put("pendingSignatures", pendingDocs);
        resp.put("completedDocuments", completedDocs);
        resp.put("draftDocuments", draftDocs);

        resp.put("recentDocuments", documentRepository.findTop5ByUploadedByOrderByCreatedAtDesc(user).stream().map(d -> Map.of(
                "id", d.getId(),
                "title", d.getTitle(),
                "fileName", d.getFileName(),
                "status", d.getStatus(),
                "pages", d.getPageCount(),
                "fileSize", d.getFileSize() != null ? d.getFileSize() : 0,
                "createdAt", d.getCreatedAt(),
                "finalHash", d.getFinalHash() != null ? d.getFinalHash() : ""
        )).toList());

        resp.put("recentActivity", auditLogRepository.findTop15ByOrderByTimestampDesc().stream().map(a -> Map.of(
                "id", a.getId(),
                "action", a.getAction(),
                "details", a.getDetails() != null ? a.getDetails() : "",
                "timestamp", a.getTimestamp(),
                "currentHash", a.getCurrentHash() != null ? a.getCurrentHash() : "",
                "ipAddress", a.getIpAddress() != null ? a.getIpAddress() : ""
        )).toList());

        return ResponseEntity.ok(resp);
    }
}

