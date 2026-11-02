package com.esign.platform.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "signer_invites")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignerInvite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "signing_request_id", nullable = false)
    private SigningRequest signingRequest;

    @Column(name = "signer_email", nullable = false)
    private String signerEmail;

    @Column(name = "signer_name", nullable = false)
    private String signerName;

    @Column
    private String phone;

    @Column(name = "sign_order")
    @Builder.Default
    private Integer signOrder = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "signing_token", nullable = false, unique = true)
    @Builder.Default
    private UUID signingToken = UUID.randomUUID();

    @Column(name = "token_expiry", nullable = false)
    @Builder.Default
    private LocalDateTime tokenExpiry = LocalDateTime.now().plusDays(7);

    @Column(name = "otp_code", length = 10)
    private String otpCode;

    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;

    @Column(name = "otp_verified", nullable = false)
    @Builder.Default
    private Boolean otpVerified = false;

    @Column(name = "otp_attempts", nullable = false)
    @Builder.Default
    private Integer otpAttempts = 0;

    @Column(name = "aadhaar_number", length = 20)
    private String aadhaarNumber;

    @Column(name = "aadhaar_verified", nullable = false)
    @Builder.Default
    private Boolean aadhaarVerified = false;

    @Column(name = "aadhaar_otp_code", length = 10)
    private String aadhaarOtpCode;

    @Column(name = "aadhaar_otp_expiry")
    private LocalDateTime aadhaarOtpExpiry;

    @Column(name = "aadhaar_txn_id", length = 64)
    private String aadhaarTxnId;

    @Column(name = "aadhaar_verified_at")
    private LocalDateTime aadhaarVerifiedAt;

    @Column(name = "signature_method")
    @Builder.Default
    private String signatureMethod = "CONTRACT_LAW_ESIGN";

    @Column(name = "decline_reason", columnDefinition = "TEXT")
    private String declineReason;

    @Column(name = "opened_at")
    private LocalDateTime openedAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "signed_at")
    private LocalDateTime signedAt;

    @Column(name = "declined_at")
    private LocalDateTime declinedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Status {
        PENDING,
        INVITED,
        OPENED,
        VERIFIED,
        SIGNED,
        DECLINED,
        EXPIRED
    }

    public boolean isExpired() {
        if (status == Status.SIGNED || status == Status.DECLINED) {
            return false;
        }
        if (status == Status.EXPIRED) {
            return true;
        }
        // If created within the last 30 days, never expire prematurely due to date-picker or system clock skew
        if (createdAt != null && createdAt.isAfter(LocalDateTime.now().minusDays(30))) {
            return false;
        }
        return tokenExpiry != null && LocalDateTime.now().isAfter(tokenExpiry);
    }

    public boolean isOtpValid(String inputOtp) {
        if (otpCode == null || inputOtp == null || otpExpiry == null) return false;
        if (LocalDateTime.now().isAfter(otpExpiry)) return false;
        return otpCode.trim().equalsIgnoreCase(inputOtp.trim());
    }

    public boolean isAadhaarOtpValid(String inputOtp) {
        if (aadhaarOtpCode == null || inputOtp == null || aadhaarOtpExpiry == null) return false;
        if (LocalDateTime.now().isAfter(aadhaarOtpExpiry)) return false;
        return aadhaarOtpCode.trim().equalsIgnoreCase(inputOtp.trim());
    }
}
