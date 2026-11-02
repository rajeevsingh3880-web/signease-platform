package com.esign.platform.repository;

import com.esign.platform.model.Document;
import com.esign.platform.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {

    List<Document> findByUploadedByOrderByCreatedAtDesc(User uploadedBy);

    Page<Document> findByUploadedByOrderByCreatedAtDesc(User uploadedBy, Pageable pageable);

    Page<Document> findByUploadedByAndStatusOrderByCreatedAtDesc(User uploadedBy, Document.Status status, Pageable pageable);

    Optional<Document> findByFinalHash(String finalHash);

    Optional<Document> findByOriginalHash(String originalHash);

    @Query("SELECT d FROM Document d WHERE d.finalHash = :hash OR d.originalHash = :hash")
    Optional<Document> findByAnyHash(@Param("hash") String hash);

    long countByUploadedBy(User uploadedBy);

    long countByUploadedByAndStatus(User uploadedBy, Document.Status status);

    long countByStatus(Document.Status status);

    @Query("SELECT d FROM Document d WHERE d.uploadedBy = :user AND LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY d.createdAt DESC")
    List<Document> searchDocuments(@Param("user") User user, @Param("keyword") String keyword);

    List<Document> findTop5ByUploadedByOrderByCreatedAtDesc(User uploadedBy);
}

