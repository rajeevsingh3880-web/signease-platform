package com.esign.platform.controller;

import com.esign.platform.model.User;
import com.esign.platform.repository.AuditLogRepository;
import com.esign.platform.repository.DocumentRepository;
import com.esign.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Transactional(readOnly = true)
public class ApiAdminController {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        return ResponseEntity.ok(userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(u -> Map.of(
                "id", u.getId(),
                "fullName", u.getFullName(),
                "email", u.getEmail(),
                "phone", u.getPhone() != null ? u.getPhone() : "",
                "role", u.getRole().name(),
                "enabled", u.getEnabled(),
                "organization", u.getOrganization() != null ? u.getOrganization().getName() : "Enterprise",
                "createdAt", u.getCreatedAt()
        )).toList());
    }

    @PostMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable("id") UUID id) {
        User target = userRepository.findById(id).orElseThrow();
        target.setEnabled(!target.getEnabled());
        userRepository.save(target);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User " + target.getEmail() + " is now " + (target.getEnabled() ? "Active" : "Disabled"),
                "enabled", target.getEnabled()
        ));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(@RequestParam(value = "page", defaultValue = "0") int page,
                                          @RequestParam(value = "size", defaultValue = "30") int size) {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size)).map(a -> Map.of(
                "id", a.getId(),
                "action", a.getAction(),
                "details", a.getDetails() != null ? a.getDetails() : "",
                "ipAddress", a.getIpAddress() != null ? a.getIpAddress() : "",
                "prevHash", a.getPrevHash() != null ? a.getPrevHash() : "",
                "currentHash", a.getCurrentHash() != null ? a.getCurrentHash() : "",
                "timestamp", a.getTimestamp()
        )));
    }

    @GetMapping("/documents")
    public ResponseEntity<?> listAllDocuments(@RequestParam(value = "page", defaultValue = "0") int page,
                                              @RequestParam(value = "size", defaultValue = "20") int size) {
        return ResponseEntity.ok(documentRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))).map(d -> Map.of(
                "id", d.getId(),
                "title", d.getTitle(),
                "fileName", d.getFileName(),
                "status", d.getStatus().name(),
                "pageCount", d.getPageCount(),
                "ownerName", d.getUploadedBy().getFullName(),
                "ownerEmail", d.getUploadedBy().getEmail(),
                "createdAt", d.getCreatedAt(),
                "finalHash", d.getFinalHash() != null ? d.getFinalHash() : ""
        )));
    }
}

