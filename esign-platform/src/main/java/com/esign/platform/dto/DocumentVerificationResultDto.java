package com.esign.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentVerificationResultDto {
    private boolean verified;
    private String statusMessage;
    private UUID documentId;
    private String title;
    private String originalHash;
    private String finalHash;
    private LocalDateTime completedAt;
    private String organizationName;
    private String senderName;
    private String senderEmail;
    private List<SignerAuditSummary> signers;
    private List<AuditTrailEntry> auditEvents;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignerAuditSummary {
        private String name;
        private String email;
        private String signatureType;
        private String legalBasis;
        private LocalDateTime signedAt;
        private String ipAddress;
        private boolean otpVerified;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuditTrailEntry {
        private String action;
        private String details;
        private String ipAddress;
        private String currentHash;
        private String prevHash;
        private LocalDateTime timestamp;
    }
}

