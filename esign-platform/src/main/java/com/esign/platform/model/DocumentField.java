package com.esign.platform.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_fields")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentField {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "signer_invite_id")
    private SignerInvite signerInvite;

    @Column(name = "page_number", nullable = false)
    @Builder.Default
    private Integer pageNumber = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "field_type", nullable = false)
    private FieldType fieldType;

    @Column(name = "field_label")
    private String fieldLabel;

    @Column(name = "pos_x", nullable = false)
    @Builder.Default
    private Float posX = 100f;

    @Column(name = "pos_y", nullable = false)
    @Builder.Default
    private Float posY = 100f;

    @Column(nullable = false)
    @Builder.Default
    private Float width = 150f;

    @Column(nullable = false)
    @Builder.Default
    private Float height = 45f;

    @Column(name = "field_value", columnDefinition = "TEXT")
    private String fieldValue;

    @Column(name = "is_required", nullable = false)
    @Builder.Default
    private Boolean isRequired = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum FieldType {
        SIGNATURE,
        DATE,
        TEXT,
        CHECKBOX
    }
}

