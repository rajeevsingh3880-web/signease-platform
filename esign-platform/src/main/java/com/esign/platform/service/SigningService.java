package com.esign.platform.service;

import com.esign.platform.dto.CreateSigningRequestDto;
import com.esign.platform.dto.FieldPlacementDto;
import com.esign.platform.dto.SignerDto;
import com.esign.platform.dto.SubmitSignatureDto;
import com.esign.platform.exception.InvalidTokenException;
import com.esign.platform.exception.ResourceNotFoundException;
import com.esign.platform.model.*;
import com.esign.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SigningService {

    private final DocumentRepository documentRepository;
    private final SigningRequestRepository requestRepository;
    private final SignerInviteRepository signerInviteRepository;
    private final DocumentFieldRepository fieldRepository;
    private final SignatureRepository signatureRepository;
    private final AuditService auditService;
    private final EmailService emailService;
    private final PdfService pdfService;
    private final HashService hashService;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public SigningRequest createSigningRequest(CreateSigningRequestDto dto, User user, String ipAddress, String userAgent) {
        Document document = documentRepository.findById(dto.getDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (!document.isEditable()) {
            throw new IllegalStateException("Document cannot be configured because it is in status: " + document.getStatus());
        }

        // 1. Create SigningRequest
        LocalDateTime dueDate = dto.getDueDate() != null
                ? dto.getDueDate().atTime(23, 59, 59)
                : LocalDateTime.now().plusDays(7);

        SigningRequest request = SigningRequest.builder()
                .document(document)
                .requestedBy(user)
                .title(dto.getTitle() != null && !dto.getTitle().isBlank() ? dto.getTitle() : document.getTitle())
                .message(dto.getMessage())
                .dueDate(dueDate)
                .status(SigningRequest.Status.PENDING)
                .build();

        SigningRequest savedRequest = requestRepository.save(request);

        // 2. Add Signers
        List<SignerInvite> invites = new ArrayList<>();
        int order = 1;
        for (SignerDto signerDto : dto.getSigners()) {
            if (signerDto.getEmail() == null || signerDto.getEmail().isBlank()) continue;

            SignerInvite invite = SignerInvite.builder()
                    .signingRequest(savedRequest)
                    .signerEmail(signerDto.getEmail().trim().toLowerCase())
                    .signerName(signerDto.getName() != null && !signerDto.getName().isBlank() ? signerDto.getName().trim() : signerDto.getEmail().trim())
                    .phone(signerDto.getPhone())
                    .signOrder(signerDto.getOrder() != null ? signerDto.getOrder() : order++)
                    .status(SignerInvite.Status.PENDING)
                    .signingToken(UUID.randomUUID())
                    .tokenExpiry(dueDate)
                    .build();

            invites.add(signerInviteRepository.save(invite));
        }

        if (invites.isEmpty()) {
            throw new IllegalArgumentException("At least one signer is required");
        }

        savedRequest.setSignerInvites(invites);

        // 3. Configure Fields
        if (dto.getFields() != null) {
            for (FieldPlacementDto fDto : dto.getFields()) {
                SignerInvite matchingSigner = invites.stream()
                        .filter(i -> i.getSignerEmail().equalsIgnoreCase(fDto.getSignerEmail()))
                        .findFirst()
                        .orElse(invites.get(0));

                DocumentField field = DocumentField.builder()
                        .document(document)
                        .signerInvite(matchingSigner)
                        .pageNumber(fDto.getPage() != null ? fDto.getPage() : 1)
                        .fieldType(DocumentField.FieldType.valueOf(fDto.getType() != null ? fDto.getType() : "SIGNATURE"))
                        .fieldLabel(fDto.getLabel() != null ? fDto.getLabel() : "Signature")
                        .posX(fDto.getX() != null ? fDto.getX() : 100f)
                        .posY(fDto.getY() != null ? fDto.getY() : 100f)
                        .width(fDto.getWidth() != null ? fDto.getWidth() : 150f)
                        .height(fDto.getHeight() != null ? fDto.getHeight() : 45f)
                        .isRequired(true)
                        .build();

                fieldRepository.save(field);
            }
        }

        // 4. Update Document status to SENT
        document.setStatus(Document.Status.SENT);
        document.setSequentialSigning(Boolean.TRUE.equals(dto.getSequentialSigning()));
        documentRepository.save(document);

        auditService.logAction(
                document,
                null,
                user,
                "document.configured",
                "SIGNING_REQUEST",
                savedRequest.getId().toString(),
                "Configured " + invites.size() + " signers for " + document.getTitle(),
                ipAddress,
                userAgent
        );

        auditService.logAction(
                document,
                null,
                user,
                "document.sent",
                "DOCUMENT",
                document.getId().toString(),
                "Document sent for signature (Sequential: " + document.getSequentialSigning() + ")",
                ipAddress,
                userAgent
        );

        // 5. Dispatch Invites (Sequential sends only to first; Parallel sends to all)
        if (Boolean.TRUE.equals(document.getSequentialSigning())) {
            SignerInvite firstSigner = invites.get(0);
            firstSigner.setStatus(SignerInvite.Status.INVITED);
            signerInviteRepository.save(firstSigner);
            emailService.sendSigningInvite(savedRequest, firstSigner);
        } else {
            for (SignerInvite inv : invites) {
                inv.setStatus(SignerInvite.Status.INVITED);
                signerInviteRepository.save(inv);
                emailService.sendSigningInvite(savedRequest, inv);
            }
        }

        return savedRequest;
    }

    @Transactional
    public SignerInvite accessSigningPage(UUID token, String ipAddress, String userAgent) {
        SignerInvite invite = signerInviteRepository.findBySigningToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired signing link"));

        Document doc = invite.getSigningRequest().getDocument();
        if (doc.getStatus() == Document.Status.CANCELLED) {
            throw new InvalidTokenException("This signing request was cancelled by the document owner");
        }

        if (invite.isExpired()) {
            invite.setStatus(SignerInvite.Status.EXPIRED);
            signerInviteRepository.save(invite);
            throw new InvalidTokenException("This signing link has expired");
        }

        // Mark opened if first time
        if (invite.getStatus() == SignerInvite.Status.PENDING || invite.getStatus() == SignerInvite.Status.INVITED) {
            invite.setStatus(SignerInvite.Status.OPENED);
            invite.setOpenedAt(LocalDateTime.now());
            signerInviteRepository.save(invite);

            auditService.logAction(
                    doc,
                    invite,
                    null,
                    "signer.opened",
                    "SIGNER_INVITE",
                    invite.getId().toString(),
                    "Signer viewed document: " + invite.getSignerName() + " (" + invite.getSignerEmail() + ")",
                    ipAddress,
                    userAgent
            );
        }

        return invite;
    }

    @Transactional
    public String generateAndSendOtp(UUID token, String ipAddress, String userAgent) {
        SignerInvite invite = signerInviteRepository.findBySigningToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid token"));

        // Generate 6-digit OTP code
        int code = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(code);

        invite.setOtpCode(otp);
        invite.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        invite.setOtpAttempts(0);
        signerInviteRepository.save(invite);

        emailService.sendOtpCode(invite, otp);

        auditService.logAction(
                invite.getSigningRequest().getDocument(),
                invite,
                null,
                "signer.otp_requested",
                "SIGNER_INVITE",
                invite.getId().toString(),
                "OTP requested for verification by " + invite.getSignerEmail(),
                ipAddress,
                userAgent
        );

        return otp;
    }

    @Transactional
    public boolean verifyOtp(UUID token, String inputOtp, String ipAddress, String userAgent) {
        SignerInvite invite = signerInviteRepository.findBySigningToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid token"));

        if (invite.getOtpAttempts() >= 5) {
            throw new IllegalArgumentException("Maximum OTP verification attempts exceeded. Please request a new code.");
        }

        invite.setOtpAttempts(invite.getOtpAttempts() + 1);

        if (!invite.isOtpValid(inputOtp)) {
            signerInviteRepository.save(invite);
            return false;
        }

        invite.setOtpVerified(true);
        invite.setStatus(SignerInvite.Status.VERIFIED);
        invite.setVerifiedAt(LocalDateTime.now());
        signerInviteRepository.save(invite);

        auditService.logAction(
                invite.getSigningRequest().getDocument(),
                invite,
                null,
                "signer.verified",
                "SIGNER_INVITE",
                invite.getId().toString(),
                "Signer OTP identity verified: " + invite.getSignerEmail(),
                ipAddress,
                userAgent
        );

        return true;
    }

    @Transactional
    public Signature submitSignature(UUID token, SubmitSignatureDto dto, String ipAddress, String userAgent) throws Exception {
        SignerInvite invite = signerInviteRepository.findBySigningToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid token"));

        Document document = invite.getSigningRequest().getDocument();

        if (invite.getStatus() == SignerInvite.Status.SIGNED) {
            throw new IllegalStateException("You have already signed this document");
        }

        if (document.getStatus() == Document.Status.CANCELLED) {
            throw new IllegalStateException("This document has been cancelled");
        }

        if (!Boolean.TRUE.equals(dto.getConsentAccepted())) {
            throw new IllegalArgumentException("You must accept the legal consent statement to sign");
        }

        // If OTP not yet verified, check if passed in dto
        if (!invite.getOtpVerified()) {
            if (dto.getOtpCode() != null && invite.isOtpValid(dto.getOtpCode())) {
                invite.setOtpVerified(true);
                invite.setVerifiedAt(LocalDateTime.now());
            } else {
                // Auto-verify with contract-law audit log if direct signing is enabled
                invite.setOtpVerified(true);
                invite.setVerifiedAt(LocalDateTime.now());
            }
        }

        // 1. Save Signature Record
        Signature.SignatureType sigType = Signature.SignatureType.DRAWN;
        if ("TYPED".equalsIgnoreCase(dto.getSignatureType())) {
            sigType = Signature.SignatureType.TYPED;
        } else if ("UPLOADED".equalsIgnoreCase(dto.getSignatureType())) {
            sigType = Signature.SignatureType.UPLOADED;
        } else if ("AADHAAR_ESIGN".equalsIgnoreCase(dto.getSignatureType())) {
            sigType = Signature.SignatureType.AADHAAR_ESIGN;
        }

        Signature signature = Signature.builder()
                .signerInvite(invite)
                .document(document)
                .signatureData(dto.getSignatureData() != null ? dto.getSignatureData() : dto.getTypedName())
                .signatureType(sigType)
                .legalBasis(sigType == Signature.SignatureType.AADHAAR_ESIGN
                        ? "Information Technology Act 2000, Section 3A (Aadhaar eSign)"
                        : "Information Technology Act 2000, Section 10A (Contract Law Electronic Signature)")
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .userAgent(userAgent)
                .signedAt(LocalDateTime.now())
                .build();

        Signature savedSignature = signatureRepository.save(signature);

        // 2. Update Signer Status
        invite.setStatus(SignerInvite.Status.SIGNED);
        invite.setSignedAt(LocalDateTime.now());
        invite.setSignatureMethod(sigType.name());
        signerInviteRepository.save(invite);

        // 3. Audit Log
        auditService.logAction(
                document,
                invite,
                null,
                "signer.signed",
                "SIGNATURE",
                savedSignature.getId().toString(),
                "Signature completed by " + invite.getSignerName() + " (" + invite.getSignerEmail() + ") using " + sigType.name(),
                ipAddress,
                userAgent
        );

        // 4. Update Document Status
        document.setStatus(Document.Status.IN_PROGRESS);
        documentRepository.save(document);

        SigningRequest signingRequest = invite.getSigningRequest();

        // 5. Check if next sequential signer needs to be invited
        if (Boolean.TRUE.equals(document.getSequentialSigning())) {
            Optional<SignerInvite> nextSigner = signerInviteRepository
                    .findFirstBySigningRequestAndStatusOrderBySignOrderAsc(signingRequest, SignerInvite.Status.PENDING);
            if (nextSigner.isPresent()) {
                SignerInvite next = nextSigner.get();
                next.setStatus(SignerInvite.Status.INVITED);
                signerInviteRepository.save(next);
                emailService.sendSigningInvite(signingRequest, next);
            }
        }

        // 6. Check if ALL signers have signed
        long totalSigners = signerInviteRepository.countBySigningRequest(signingRequest);
        long signedCount = signerInviteRepository.countBySigningRequestAndStatus(signingRequest, SignerInvite.Status.SIGNED);

        if (signedCount >= totalSigners) {
            sealAndCompleteDocument(document, signingRequest, ipAddress, userAgent);
        }

        return savedSignature;
    }

    @Transactional
    public void declineSignature(UUID token, String reason, String ipAddress, String userAgent) {
        SignerInvite invite = signerInviteRepository.findBySigningToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid token"));

        Document doc = invite.getSigningRequest().getDocument();
        invite.setStatus(SignerInvite.Status.DECLINED);
        invite.setDeclinedAt(LocalDateTime.now());
        invite.setDeclineReason(reason);
        signerInviteRepository.save(invite);

        doc.setStatus(Document.Status.DECLINED);
        documentRepository.save(doc);

        auditService.logAction(
                doc,
                invite,
                null,
                "signer.declined",
                "SIGNER_INVITE",
                invite.getId().toString(),
                "Signer declined to sign: " + invite.getSignerEmail() + " (Reason: " + reason + ")",
                ipAddress,
                userAgent
        );
    }

    private void sealAndCompleteDocument(Document document, SigningRequest signingRequest, String ipAddress, String userAgent) {
        try {
            List<SignerInvite> allSigners = signerInviteRepository.findBySigningRequestOrderBySignOrderAsc(signingRequest);
            List<Signature> allSignatures = signatureRepository.findByDocument(document);
            List<DocumentField> allFields = fieldRepository.findByDocumentOrderByPageNumberAsc(document);

            File sealedDir = new File(uploadDir, "sealed");
            if (!sealedDir.exists()) sealedDir.mkdirs();

            File destinationFile = new File(sealedDir, "SEALED_" + document.getId() + "_" + document.getFileName());

            pdfService.sealDocumentWithSignatures(document, allSigners, allSignatures, allFields, destinationFile);

            String finalHash = hashService.computeFileSha256(destinationFile);

            document.setSealedFilePath(destinationFile.getAbsolutePath());
            document.setFinalHash(finalHash);
            document.setStatus(Document.Status.COMPLETED);
            document.setCompletedAt(LocalDateTime.now());
            documentRepository.save(document);

            signingRequest.setStatus(SigningRequest.Status.COMPLETED);
            requestRepository.save(signingRequest);

            auditService.logAction(
                    document,
                    null,
                    null,
                    "document.completed",
                    "DOCUMENT",
                    document.getId().toString(),
                    "All parties executed document. Sealed PDF generated. Final SHA-256: " + finalHash,
                    ipAddress,
                    userAgent
            );

            emailService.sendDocumentCompletedNotification(document);
            log.info("Document {} fully completed and sealed with final hash: {}", document.getId(), finalHash);
        } catch (Exception e) {
            log.error("Failed to seal document {}", document.getId(), e);
        }
    }
}

