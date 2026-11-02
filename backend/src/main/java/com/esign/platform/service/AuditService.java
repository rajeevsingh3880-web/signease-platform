package com.esign.platform.service;

import com.esign.platform.model.AuditLog;
import com.esign.platform.model.Document;
import com.esign.platform.model.SignerInvite;
import com.esign.platform.model.User;
import com.esign.platform.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final HashService hashService;

    @Transactional(propagation = Propagation.REQUIRED)
    public AuditLog logAction(Document document,
                              SignerInvite signer,
                              User performedBy,
                              String action,
                              String entityType,
                              String entityId,
                              String details,
                              String ipAddress,
                              String userAgent) {

        String prevHash = "GENESIS_ROOT_HASH";
        if (document != null) {
            Optional<AuditLog> lastLog = auditLogRepository.findTopByDocumentOrderByTimestampDesc(document);
            if (lastLog.isPresent() && lastLog.get().getCurrentHash() != null) {
                prevHash = lastLog.get().getCurrentHash();
            }
        }

        LocalDateTime now = LocalDateTime.now();
        String currentHash = hashService.computeAuditHash(
                prevHash, action, entityId, now.toString(), ipAddress
        );

        AuditLog auditLog = AuditLog.builder()
                .document(document)
                .signer(signer)
                .performedBy(performedBy)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .userAgent(userAgent)
                .prevHash(prevHash)
                .currentHash(currentHash)
                .timestamp(now)
                .build();

        AuditLog saved = auditLogRepository.save(auditLog);
        log.info("Audit logged [{}]: document={} action={} hash={}", saved.getId(),
                document != null ? document.getId() : "N/A", action, currentHash);
        return saved;
    }

    public List<AuditLog> getDocumentAuditLogs(UUID documentId) {
        return auditLogRepository.findByDocumentIdOrderByTimestampAsc(documentId);
    }
}

