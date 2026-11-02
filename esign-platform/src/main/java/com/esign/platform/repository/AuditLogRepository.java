package com.esign.platform.repository;

import com.esign.platform.model.AuditLog;
import com.esign.platform.model.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    List<AuditLog> findByDocumentOrderByTimestampAsc(Document document);

    List<AuditLog> findByDocumentIdOrderByTimestampAsc(UUID documentId);

    Optional<AuditLog> findTopByDocumentOrderByTimestampDesc(Document document);

    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);

    List<AuditLog> findTop15ByOrderByTimestampDesc();
}

