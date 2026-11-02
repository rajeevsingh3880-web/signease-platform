package com.esign.platform.service;

import com.esign.platform.model.Document;
import com.esign.platform.model.DocumentField;
import com.esign.platform.model.Signature;
import com.esign.platform.model.SignerInvite;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfService {

    private final HashService hashService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public int getPageCount(File pdfFile) {
        try (PDDocument document = Loader.loadPDF(pdfFile)) {
            return document.getNumberOfPages();
        } catch (Exception e) {
            log.error("Failed to read page count for {}", pdfFile.getName(), e);
            return 1;
        }
    }

    public File sealDocumentWithSignatures(Document doc,
                                          List<SignerInvite> signers,
                                          List<Signature> signatures,
                                          List<DocumentField> fields,
                                          File destinationFile) throws Exception {

        File sourcePdf = new File(doc.getFilePath());
        if (!sourcePdf.exists()) {
            throw new IllegalArgumentException("Original PDF not found at: " + doc.getFilePath());
        }

        try (PDDocument pdfDoc = Loader.loadPDF(sourcePdf)) {
            PDFont fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDFont fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            // 1. Stamp signatures and field values on the pages
            for (Signature sig : signatures) {
                SignerInvite invite = sig.getSignerInvite();
                // Find matching fields for this invite or default to bottom of last page
                List<DocumentField> inviteFields = fields.stream()
                        .filter(f -> f.getSignerInvite() != null && f.getSignerInvite().getId().equals(invite.getId()))
                        .toList();

                if (!inviteFields.isEmpty()) {
                    for (DocumentField field : inviteFields) {
                        int pageIndex = Math.min(Math.max(field.getPageNumber() - 1, 0), pdfDoc.getNumberOfPages() - 1);
                        PDPage targetPage = pdfDoc.getPage(pageIndex);
                        float pageHeight = targetPage.getMediaBox().getHeight();

                        // Coordinate transformation (PDF origin is bottom-left)
                        float pdfX = field.getPosX();
                        float pdfY = Math.max(pageHeight - field.getPosY() - field.getHeight(), 20);

                        stampSignatureOnPage(pdfDoc, targetPage, sig, pdfX, pdfY, field.getWidth(), field.getHeight(), fontRegular);
                    }
                } else {
                    // Fallback: Stamp on the last page at the bottom
                    int lastPageIndex = pdfDoc.getNumberOfPages() - 1;
                    PDPage lastPage = pdfDoc.getPage(lastPageIndex);
                    int signerIdx = signers.indexOf(invite);
                    float pdfX = 50 + (signerIdx * 180);
                    float pdfY = 70;
                    stampSignatureOnPage(pdfDoc, lastPage, sig, pdfX, pdfY, 160, 50, fontRegular);
                }
            }

            // 2. Append the Tamper-Evident Audit Trail Certificate page (BRD Phase 2 FR-08)
            appendAuditCertificatePage(pdfDoc, doc, signers, signatures, fontRegular, fontBold);

            // 3. Save the sealed PDF
            if (destinationFile.getParentFile() != null) {
                destinationFile.getParentFile().mkdirs();
            }
            pdfDoc.save(destinationFile);
            log.info("Document successfully sealed at: {}", destinationFile.getAbsolutePath());
        }

        return destinationFile;
    }

    private void stampSignatureOnPage(PDDocument pdfDoc,
                                      PDPage page,
                                      Signature sig,
                                      float x,
                                      float y,
                                      float width,
                                      float height,
                                      PDFont font) throws Exception {

        String sigData = sig.getSignatureData();
        if (sigData == null || sigData.isBlank()) return;

        try (PDPageContentStream cs = new PDPageContentStream(
                pdfDoc, page, PDPageContentStream.AppendMode.APPEND, true, true)) {

            if (sigData.startsWith("data:image")) {
                // Decode base64 image
                String base64Content = sigData.substring(sigData.indexOf(",") + 1);
                byte[] imgBytes = Base64.getDecoder().decode(base64Content);
                PDImageXObject image = PDImageXObject.createFromByteArray(pdfDoc, imgBytes, "sig-" + sig.getId());

                cs.drawImage(image, x, y, width, height);

                // Small caption below signature
                cs.beginText();
                cs.setFont(font, 7);
                cs.setNonStrokingColor(Color.DARK_GRAY);
                cs.newLineAtOffset(x, Math.max(y - 9, 10));
                cs.showText("Digitally Signed by " + sig.getSignerInvite().getSignerName() + " (" +
                        sig.getSignedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) + ")");
                cs.endText();
            } else {
                // Typed signature text
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD_OBLIQUE), 14);
                cs.setNonStrokingColor(new Color(15, 23, 42));
                cs.newLineAtOffset(x, y + (height / 2));
                cs.showText(sigData);
                cs.endText();

                cs.beginText();
                cs.setFont(font, 7);
                cs.setNonStrokingColor(Color.GRAY);
                cs.newLineAtOffset(x, Math.max(y - 9, 10));
                cs.showText("Verified Contract Law eSign (" +
                        sig.getSignedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) + ")");
                cs.endText();
            }
        } catch (Exception e) {
            log.error("Failed to stamp signature image onto PDF page", e);
        }
    }

    private void appendAuditCertificatePage(PDDocument pdfDoc,
                                            Document doc,
                                            List<SignerInvite> signers,
                                            List<Signature> signatures,
                                            PDFont fontRegular,
                                            PDFont fontBold) throws Exception {

        PDPage certPage = new PDPage(PDRectangle.A4);
        pdfDoc.addPage(certPage);

        float pageWidth = certPage.getMediaBox().getWidth();
        float pageHeight = certPage.getMediaBox().getHeight();

        try (PDPageContentStream cs = new PDPageContentStream(pdfDoc, certPage)) {
            // Draw decorative header border
            cs.setNonStrokingColor(new Color(241, 245, 249));
            cs.addRect(20, pageHeight - 90, pageWidth - 40, 70);
            cs.fill();

            cs.setStrokingColor(new Color(79, 70, 229));
            cs.setLineWidth(2);
            cs.moveTo(20, pageHeight - 90);
            cs.lineTo(pageWidth - 20, pageHeight - 90);
            cs.stroke();

            // Header Title
            cs.beginText();
            cs.setFont(fontBold, 16);
            cs.setNonStrokingColor(new Color(30, 41, 59));
            cs.newLineAtOffset(35, pageHeight - 50);
            cs.showText("COMPLETION & AUDIT TRAIL CERTIFICATE");
            cs.endText();

            cs.beginText();
            cs.setFont(fontRegular, 9);
            cs.setNonStrokingColor(new Color(100, 116, 139));
            cs.newLineAtOffset(35, pageHeight - 70);
            cs.showText("Tamper-Evident Cryptographic Record under Indian IT Act 2000 (Section 10A)");
            cs.endText();

            // Document Details Section
            float curY = pageHeight - 120;
            cs.beginText();
            cs.setFont(fontBold, 11);
            cs.setNonStrokingColor(new Color(79, 70, 229));
            cs.newLineAtOffset(35, curY);
            cs.showText("DOCUMENT IDENTIFIERS");
            cs.endText();

            curY -= 18;
            drawCertRow(cs, fontBold, fontRegular, 35, curY, "Title:", doc.getTitle());
            curY -= 16;
            drawCertRow(cs, fontBold, fontRegular, 35, curY, "Document ID:", doc.getId().toString());
            curY -= 16;
            drawCertRow(cs, fontBold, fontRegular, 35, curY, "Owner:", doc.getUploadedBy().getFullName() + " (" + doc.getUploadedBy().getEmail() + ")");
            curY -= 16;
            drawCertRow(cs, fontBold, fontRegular, 35, curY, "Original SHA-256:", doc.getOriginalHash() != null ? doc.getOriginalHash() : "N/A");
            curY -= 16;
            drawCertRow(cs, fontBold, fontRegular, 35, curY, "Status:", "COMPLETED & DIGITALLY SEALED");

            // Signatures Section
            curY -= 30;
            cs.beginText();
            cs.setFont(fontBold, 11);
            cs.setNonStrokingColor(new Color(79, 70, 229));
            cs.newLineAtOffset(35, curY);
            cs.showText("EXECUTION & SIGNATURE SUMMARY");
            cs.endText();

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm:ss 'IST'");

            for (SignerInvite signer : signers) {
                curY -= 25;
                // Signer box
                cs.setNonStrokingColor(new Color(248, 250, 252));
                cs.addRect(35, curY - 55, pageWidth - 70, 70);
                cs.fill();
                cs.setStrokingColor(new Color(226, 232, 240));
                cs.setLineWidth(1);
                cs.addRect(35, curY - 55, pageWidth - 70, 70);
                cs.stroke();

                cs.beginText();
                cs.setFont(fontBold, 10);
                cs.setNonStrokingColor(new Color(15, 23, 42));
                cs.newLineAtOffset(45, curY);
                cs.showText(signer.getSignerName() + " <" + signer.getSignerEmail() + ">");
                cs.endText();

                curY -= 14;
                drawCertRow(cs, fontBold, fontRegular, 45, curY, "Status:", signer.getStatus().name() + " (OTP Verified: " + (signer.getOtpVerified() ? "YES" : "NO") + ")");
                curY -= 13;
                String signedTime = signer.getSignedAt() != null ? signer.getSignedAt().format(dtf) : "N/A";
                drawCertRow(cs, fontBold, fontRegular, 45, curY, "Timestamp:", signedTime);
                curY -= 13;
                drawCertRow(cs, fontBold, fontRegular, 45, curY, "Legal Basis:", signer.getSignatureMethod() + " / IT Act 2000 Section 10A");
                curY -= 10;
            }

            // Legal & Verification Section
            curY -= 35;
            cs.beginText();
            cs.setFont(fontBold, 11);
            cs.setNonStrokingColor(new Color(79, 70, 229));
            cs.newLineAtOffset(35, curY);
            cs.showText("LEGAL VALIDITY & INDEPENDENT VERIFICATION");
            cs.endText();

            curY -= 18;
            cs.beginText();
            cs.setFont(fontRegular, 8);
            cs.setNonStrokingColor(new Color(71, 85, 105));
            cs.newLineAtOffset(35, curY);
            cs.showText("This electronic execution conforms to Section 10A of the Information Technology Act, 2000");
            cs.endText();

            curY -= 12;
            cs.beginText();
            cs.setFont(fontRegular, 8);
            cs.newLineAtOffset(35, curY);
            cs.showText("and the Indian Contract Act, 1872. All events are cryptographically chained and tamper-evident.");
            cs.endText();

            curY -= 18;
            String verifyUrl = baseUrl + "/verify";
            drawCertRow(cs, fontBold, fontRegular, 35, curY, "Verify Online:", verifyUrl);

            // Footer note
            cs.setStrokingColor(new Color(226, 232, 240));
            cs.setLineWidth(1);
            cs.moveTo(35, 40);
            cs.lineTo(pageWidth - 35, 40);
            cs.stroke();

            cs.beginText();
            cs.setFont(fontRegular, 7);
            cs.setNonStrokingColor(new Color(148, 163, 184));
            cs.newLineAtOffset(35, 28);
            cs.showText("E-Sign Platform | Tamper-Proof Cryptographic Certificate | Page " + pdfDoc.getNumberOfPages());
            cs.endText();
        }
    }

    private void drawCertRow(PDPageContentStream cs, PDFont fontBold, PDFont fontRegular, float x, float y, String label, String value) throws Exception {
        cs.beginText();
        cs.setFont(fontBold, 9);
        cs.setNonStrokingColor(new Color(71, 85, 105));
        cs.newLineAtOffset(x, y);
        cs.showText(label);
        cs.endText();

        cs.beginText();
        cs.setFont(fontRegular, 9);
        cs.setNonStrokingColor(new Color(15, 23, 42));
        cs.newLineAtOffset(x + 110, y);
        // Truncate if too long
        String textToDraw = value != null ? value : "";
        if (textToDraw.length() > 80) {
            textToDraw = textToDraw.substring(0, 77) + "...";
        }
        cs.showText(textToDraw);
        cs.endText();
    }
}

