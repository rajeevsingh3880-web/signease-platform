package com.esign.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "signatures")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Signature {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "signer_invite_id", nullable = false)
    private SignerInvite signerInvite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "signature_data", columnDefinition = "TEXT", nullable = false)
    private String signatureData;

    @Enumerated(EnumType.STRING)
    @Column(name = "signature_type", nullable = false)
    @Builder.Default
    private SignatureType signatureType = SignatureType.DRAWN;

    @Column(name = "legal_basis", nullable = false)
    @Builder.Default
    private String legalBasis = "Information Technology Act 2000, Section 10A (Contract Law Electronic Signature)";

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "signed_at", nullable = false)
    @Builder.Default
    private LocalDateTime signedAt = LocalDateTime.now();

    public enum SignatureType {
        DRAWN,
        TYPED,
        UPLOADED,
        AADHAAR_ESIGN,
        DSC_SIGN
    }
}
