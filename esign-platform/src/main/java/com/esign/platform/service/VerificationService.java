package com.esign.platform.service;

import com.esign.platform.dto.DocumentVerificationResultDto;
import com.esign.platform.model.AuditLog;
import com.esign.platform.model.Document;
import com.esign.platform.model.Signature;
import com.esign.platform.model.SignerInvite;
import com.esign.platform.repository.AuditLogRepository;
import com.esign.platform.repository.DocumentRepository;
import com.esign.platform.repository.SignatureRepository;
import com.esign.platform.repository.SignerInviteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationService {

    private final DocumentRepository documentRepository;
    private final SignatureRepository signatureRepository;
    private final SignerInviteRepository signerInviteRepository;
    private final AuditLogRepository auditLogRepository;
    private final HashService hashService;

    public DocumentVerificationResultDto verifyByHash(String hash) {
        if (hash == null || hash.isBlank()) {
            return DocumentVerificationResultDto.builder()
                    .verified(false)
                    .statusMessage("No hash provided for verification")
                    .build();
        }

        String cleanHash = hash.trim().toLowerCase();
        Optional<Document> docOpt = documentRepository.findByAnyHash(cleanHash);

        if (docOpt.isEmpty()) {
            // Also try by UUID if someone enters document ID directly
            try {
                UUID id = UUID.fromString(cleanHash);
                docOpt = documentRepository.findById(id);
            } catch (Exception ignored) {}
        }

        if (docOpt.isEmpty()) {
            return DocumentVerificationResultDto.builder()
                    .verified(false)
                    .statusMessage("Hash not recognized in platform ledger. Document may be unsealed, counterfeit, or altered.")
                    .build();
        }

        Document document = docOpt.get();
        boolean isFinalMatch = cleanHash.equalsIgnoreCase(document.getFinalHash());
        boolean isOriginalMatch = cleanHash.equalsIgnoreCase(document.getOriginalHash());

        String statusMsg;
        if (isFinalMatch) {
            statusMsg = "AUTHENTIC & VERIFIED: Matches final sealed document fingerprint exactly.";
        } else if (isOriginalMatch) {
            statusMsg = "ORIGINAL DRAFT VERIFIED: Matches document pre-execution fingerprint.";
        } else {
            statusMsg = "DOCUMENT FOUND: Current status is " + document.getStatus();
        }

        // Collect Signatures
        List<Signature> signatures = signatureRepository.findByDocument(document);
        List<DocumentVerificationResultDto.SignerAuditSummary> signerSummaries = new ArrayList<>();
        for (Signature s : signatures) {
            signerSummaries.add(DocumentVerificationResultDto.SignerAuditSummary.builder()
                    .name(s.getSignerInvite().getSignerName())
                    .email(s.getSignerInvite().getSignerEmail())
                    .signatureType(s.getSignatureType().name())
                    .legalBasis(s.getLegalBasis())
                    .signedAt(s.getSignedAt())
                    .ipAddress(s.getIpAddress())
                    .otpVerified(s.getSignerInvite().getOtpVerified())
                    .build());
        }

        // Collect Chained Audit Events
        List<AuditLog> auditLogs = auditLogRepository.findByDocumentOrderByTimestampAsc(document);
        List<DocumentVerificationResultDto.AuditTrailEntry> auditEntries = new ArrayList<>();
        for (AuditLog logEntry : auditLogs) {
            auditEntries.add(DocumentVerificationResultDto.AuditTrailEntry.builder()
                    .action(logEntry.getAction())
                    .details(logEntry.getDetails())
                    .ipAddress(logEntry.getIpAddress())
                    .currentHash(logEntry.getCurrentHash())
                    .prevHash(logEntry.getPrevHash())
                    .timestamp(logEntry.getTimestamp())
                    .build());
        }

        return DocumentVerificationResultDto.builder()
                .verified(true)
                .statusMessage(statusMsg)
                .documentId(document.getId())
                .title(document.getTitle())
                .originalHash(document.getOriginalHash())
                .finalHash(document.getFinalHash())
                .completedAt(document.getCompletedAt())
                .organizationName(document.getOrganization() != null ? document.getOrganization().getName() : "Enterprise")
                .senderName(document.getUploadedBy().getFullName())
                .senderEmail(document.getUploadedBy().getEmail())
                .signers(signerSummaries)
                .auditEvents(auditEntries)
                .build();
    }

    public DocumentVerificationResultDto verifyUploadedFile(MultipartFile file) {
        try {
            File temp = File.createTempFile("verify_", file.getOriginalFilename());
            try (InputStream is = file.getInputStream(); OutputStream os = new FileOutputStream(temp)) {
                is.transferTo(os);
            }
            String calculatedHash = hashService.computeFileSha256(temp);
            temp.delete();

            DocumentVerificationResultDto result = verifyByHash(calculatedHash);
            if (!result.isVerified()) {
                result.setStatusMessage("Calculated SHA-256 (" + calculatedHash + ") does not match any sealed document.");
            }
            return result;
        } catch (Exception e) {
            log.error("Failed to verify uploaded file", e);
            return DocumentVerificationResultDto.builder()
                    .verified(false)
                    .statusMessage("Failed to process file: " + e.getMessage())
                    .build();
        }
    }
}

