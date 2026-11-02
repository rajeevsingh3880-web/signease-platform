package com.esign.platform.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id")
    private Organization organization;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "sealed_file_path")
    private String sealedFilePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "page_count")
    @Builder.Default
    private Integer pageCount = 1;

    @Column(name = "mime_type")
    private String mimeType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.DRAFT;

    @Column(name = "original_hash", length = 64)
    private String originalHash;

    @Column(name = "final_hash", length = 64)
    private String finalHash;

    @Column(name = "sequential_signing", nullable = false)
    @Builder.Default
    private Boolean sequentialSigning = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status {
        DRAFT,
        SENT,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        DECLINED,
        EXPIRED
    }

    public boolean isEditable() {
        return status == Status.DRAFT;
    }

    public boolean isSealed() {
        return status == Status.COMPLETED && finalHash != null;
    }
}
