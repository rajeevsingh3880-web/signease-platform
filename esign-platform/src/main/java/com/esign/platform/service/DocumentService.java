package com.esign.platform.service;

import com.esign.platform.dto.DocumentUploadDto;
import com.esign.platform.exception.ResourceNotFoundException;
import com.esign.platform.model.Document;
import com.esign.platform.model.User;
import com.esign.platform.repository.DocumentFieldRepository;
import com.esign.platform.repository.DocumentRepository;
import com.esign.platform.repository.SigningRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentFieldRepository fieldRepository;
    private final SigningRequestRepository requestRepository;
    private final HashService hashService;
    private final PdfService pdfService;
    private final AuditService auditService;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Transactional
    public Document uploadDocument(DocumentUploadDto dto, User uploadedBy, String ipAddress, String userAgent) throws Exception {
        File uploadFolder = new File(uploadDir, "documents");
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        String originalFilename;
        File savedFile;
        long fileSize;

        if (dto.getFile() != null && !dto.getFile().isEmpty()) {
            originalFilename = dto.getFile().getOriginalFilename();
            if (originalFilename == null) originalFilename = "document.pdf";
            String uniqueName = UUID.randomUUID() + "_" + originalFilename;
            savedFile = new File(uploadFolder, uniqueName);

            try (InputStream is = dto.getFile().getInputStream();
                 OutputStream os = new FileOutputStream(savedFile)) {
                is.transferTo(os);
            }
            fileSize = dto.getFile().getSize();
        } else {
            // Generate a sample demo agreement PDF if no file was uploaded
            originalFilename = "Sample_Service_Agreement.pdf";
            String uniqueName = UUID.randomUUID() + "_" + originalFilename;
            savedFile = new File(uploadFolder, uniqueName);
            generateSamplePdf(savedFile, dto.getTitle() != null ? dto.getTitle() : "Master Services Agreement");
            fileSize = savedFile.length();
        }

        // Calculate cryptographic SHA-256 original hash
        String originalHash = hashService.computeFileSha256(savedFile);
        int pageCount = pdfService.getPageCount(savedFile);

        Document doc = Document.builder()
                .organization(uploadedBy.getOrganization())
                .title(dto.getTitle() != null && !dto.getTitle().isBlank() ? dto.getTitle() : originalFilename)
                .description(dto.getDescription())
                .fileName(originalFilename)
                .filePath(savedFile.getAbsolutePath())
                .fileSize(fileSize)
                .mimeType("application/pdf")
                .pageCount(pageCount)
                .status(Document.Status.DRAFT)
                .originalHash(originalHash)
                .sequentialSigning(Boolean.TRUE.equals(dto.getSequentialSigning()))
                .uploadedBy(uploadedBy)
                .expiryDate(dto.getExpiryDate() != null ? dto.getExpiryDate().atTime(23, 59, 59) : LocalDateTime.now().plusDays(30))
                .build();

        Document savedDoc = documentRepository.save(doc);

        auditService.logAction(
                savedDoc,
                null,
                uploadedBy,
                "document.created",
                "DOCUMENT",
                savedDoc.getId().toString(),
                "Document uploaded: " + savedDoc.getTitle() + " (SHA-256: " + originalHash + ", pages: " + pageCount + ")",
                ipAddress,
                userAgent
        );

        return savedDoc;
    }

    public Document getDocumentById(UUID id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
    }

    public List<Document> getUserDocuments(User user) {
        return documentRepository.findByUploadedByOrderByCreatedAtDesc(user);
    }

    public Page<Document> getUserDocuments(User user, Pageable pageable) {
        return documentRepository.findByUploadedByOrderByCreatedAtDesc(user, pageable);
    }

    public Page<Document> getUserDocumentsByStatus(User user, Document.Status status, Pageable pageable) {
        return documentRepository.findByUploadedByAndStatusOrderByCreatedAtDesc(user, status, pageable);
    }

    public List<Document> searchDocuments(User user, String query) {
        if (query == null || query.isBlank()) {
            return getUserDocuments(user);
        }
        return documentRepository.searchDocuments(user, query);
    }

    public Resource getDocumentResource(Document document, boolean preferSealed) {
        String path = (preferSealed && document.getSealedFilePath() != null)
                ? document.getSealedFilePath()
                : document.getFilePath();

        File file = new File(path);
        if (!file.exists()) {
            throw new ResourceNotFoundException("Physical file not found for document: " + document.getTitle());
        }
        return new FileSystemResource(file);
    }

    @Transactional
    public void cancelDocument(UUID id, User user, String ipAddress, String userAgent) {
        Document doc = getDocumentById(id);
        if (!doc.getUploadedBy().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("You are not authorized to cancel this document");
        }

        doc.setStatus(Document.Status.CANCELLED);
        documentRepository.save(doc);

        auditService.logAction(
                doc,
                null,
                user,
                "document.cancelled",
                "DOCUMENT",
                doc.getId().toString(),
                "Document cancelled by owner: " + user.getEmail(),
                ipAddress,
                userAgent
        );
    }

    private void generateSamplePdf(File targetFile, String title) {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
                cs.newLineAtOffset(50, 720);
                cs.showText(title);
                cs.endText();

                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
                cs.newLineAtOffset(50, 680);
                cs.showText("This is an electronically executed legal instrument generated by SignEase Platform.");
                cs.newLineAtOffset(0, -20);
                cs.showText("Parties agree to be legally bound by terms herein under the Indian IT Act 2000 (Section 10A).");
                cs.newLineAtOffset(0, -30);
                cs.showText("1. OBLIGATIONS AND COVENANTS");
                cs.newLineAtOffset(0, -18);
                cs.showText("   The Parties agree to perform services with due care, professionalism, and integrity.");
                cs.newLineAtOffset(0, -25);
                cs.showText("2. CONFIDENTIALITY AND NON-DISCLOSURE");
                cs.newLineAtOffset(0, -18);
                cs.showText("   All proprietary data shared between the parties shall remain confidential.");
                cs.newLineAtOffset(0, -25);
                cs.showText("3. EXECUTION AND COUNTERPARTS");
                cs.newLineAtOffset(0, -18);
                cs.showText("   This document may be executed in counterparts by verifiable electronic signatures.");
                cs.newLineAtOffset(0, -80);
                cs.showText("IN WITNESS WHEREOF, the parties hereto have digitally executed this instrument:");
                cs.endText();
            }

            targetFile.getParentFile().mkdirs();
            doc.save(targetFile);
        } catch (Exception e) {
            log.error("Failed to generate sample PDF", e);
        }
    }
}

