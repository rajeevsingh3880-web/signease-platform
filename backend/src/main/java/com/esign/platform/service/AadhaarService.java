package com.esign.platform.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.regex.Pattern;

@Service
@Slf4j
public class AadhaarService {

    private static final Pattern CLEAN_PATTERN = Pattern.compile("[^0-9]");

    // Verhoeff Algorithm multiplication table
    private static final int[][] D = {
            {0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
            {1, 2, 3, 4, 0, 6, 7, 8, 9, 5},
            {2, 3, 4, 0, 1, 7, 8, 9, 5, 6},
            {3, 4, 0, 1, 2, 8, 9, 5, 6, 7},
            {4, 0, 1, 2, 3, 9, 5, 6, 7, 8},
            {5, 9, 8, 7, 6, 0, 4, 3, 2, 1},
            {6, 5, 9, 8, 7, 1, 0, 4, 3, 2},
            {7, 6, 5, 9, 8, 2, 1, 0, 4, 3},
            {8, 7, 6, 5, 9, 3, 2, 1, 0, 4},
            {9, 8, 7, 6, 5, 4, 3, 2, 1, 0}
    };

    // Verhoeff permutation table
    private static final int[][] P = {
            {0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
            {1, 5, 7, 6, 2, 8, 3, 0, 9, 4},
            {5, 8, 0, 3, 7, 9, 6, 1, 4, 2},
            {8, 9, 1, 6, 0, 4, 3, 5, 2, 7},
            {9, 4, 5, 3, 1, 2, 6, 8, 7, 0},
            {4, 2, 8, 6, 5, 7, 3, 9, 0, 1},
            {2, 7, 9, 3, 8, 0, 6, 4, 1, 5},
            {7, 0, 4, 6, 9, 1, 3, 2, 5, 8}
    };

    public boolean validateAadhaarNumber(String aadhaar) {
        if (aadhaar == null) return false;
        String clean = CLEAN_PATTERN.matcher(aadhaar).replaceAll("");
        if (clean.length() != 12) return false;
        // Aadhaar numbers never start with 0 or 1
        if (clean.startsWith("0") || clean.startsWith("1")) return false;

        // Reject identical repetitive numbers (e.g. 222222222222)
        if (clean.chars().distinct().count() <= 1) return false;

        return clean.matches("^[2-9][0-9]{11}$");
    }

    public String cleanAadhaar(String aadhaar) {
        if (aadhaar == null) return "";
        return CLEAN_PATTERN.matcher(aadhaar).replaceAll("");
    }

    public String maskAadhaar(String cleanAadhaar) {
        if (cleanAadhaar == null || cleanAadhaar.length() < 4) {
            return "XXXXXXXX0000";
        }
        int len = cleanAadhaar.length();
        String last4 = cleanAadhaar.substring(len - 4);
        return "XXXXXXXX" + last4;
    }

    public String generateAadhaarStampBase64(String signerName,
                                            String maskedAadhaar,
                                            String txnId,
                                            LocalDateTime timestamp) {
        int width = 450;
        int height = 155;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = image.createGraphics();

        try {
            // Enable antialiasing for crisp text and graphics
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            // Background
            g.setColor(new Color(255, 255, 255));
            g.fillRoundRect(2, 2, width - 4, height - 4, 12, 12);

            // Border (Navy + subtle Indian tricolor accent)
            g.setColor(new Color(30, 58, 138));
            g.setStroke(new BasicStroke(2.0f));
            g.drawRoundRect(2, 2, width - 4, height - 4, 12, 12);

            // Top Header Bar
            g.setColor(new Color(241, 245, 249));
            g.fillRoundRect(4, 4, width - 8, 30, 10, 10);
            g.fillRect(4, 20, width - 8, 14);

            // Tricolor Accent Stripes on left
            g.setColor(new Color(255, 153, 51)); // Saffron
            g.fillRect(4, 4, 6, 30);
            g.setColor(new Color(19, 136, 8)); // Green
            g.fillRect(4, 34, 6, height - 38);

            // Header text
            g.setColor(new Color(30, 58, 138));
            g.setFont(new Font("SansSerif", Font.BOLD, 12));
            g.drawString("AADHAAR e-SIGN (UIDAI AUTHENTICATED)", 20, 24);

            g.setFont(new Font("SansSerif", Font.PLAIN, 10));
            g.setColor(new Color(100, 116, 139));
            g.drawString("IT Act 2000 Sec 3A", width - 115, 24);

            // Verified Tick Icon Box
            g.setColor(new Color(220, 252, 231));
            g.fillOval(18, 48, 40, 40);
            g.setColor(new Color(22, 163, 74));
            g.setStroke(new BasicStroke(2.0f));
            g.drawOval(18, 48, 40, 40);
            g.setFont(new Font("SansSerif", Font.BOLD, 18));
            g.drawString("\u2713", 31, 74);

            // Details
            int textX = 72;
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss");
            String timeStr = (timestamp != null ? timestamp.format(dtf) : LocalDateTime.now().format(dtf)) + " IST";

            g.setFont(new Font("SansSerif", Font.BOLD, 12));
            g.setColor(new Color(15, 23, 42));
            g.drawString("Digitally Signed by: " + (signerName != null ? signerName : "Signer"), textX, 58);

            g.setFont(new Font("SansSerif", Font.PLAIN, 10));
            g.setColor(new Color(51, 65, 85));
            g.drawString("Aadhaar Number: " + maskedAadhaar, textX, 76);
            g.drawString("UIDAI Txn Ref: " + (txnId != null ? txnId : "UIDAI-ESIGN-MOCK"), textX, 93);
            g.drawString("Timestamp: " + timeStr, textX, 110);

            // Legal verification stamp
            g.setColor(new Color(22, 163, 74));
            g.setFont(new Font("SansSerif", Font.BOLD, 9));
            g.drawString("\u25CF Verified via UIDAI OTP e-KYC (Section 3A, IT Act 2000)", textX, 128);

            g.setColor(new Color(148, 163, 184));
            g.setFont(new Font("SansSerif", Font.PLAIN, 8));
            g.drawString("SignEase Trust Network \u2022 Tamper-Evident Digital Signature", textX, 142);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (Exception e) {
            log.error("Failed to generate Aadhaar eSign stamp", e);
            return "";
        } finally {
            g.dispose();
        }
    }
}

