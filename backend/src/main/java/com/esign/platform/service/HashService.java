package com.esign.platform.service;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class HashService {

    public String computeSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(data);
            return bytesToHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public String computeFileSha256(File file) {
        try (InputStream is = new FileInputStream(file)) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int read;
            while ((read = is.read(buffer)) != -1) {
                digest.update(buffer, 0, read);
            }
            return bytesToHex(digest.digest());
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate SHA-256 for file: " + file.getName(), e);
        }
    }

    public String computeAuditHash(String prevHash, String action, String entityId, String timestamp, String ip) {
        String input = (prevHash != null ? prevHash : "GENESIS") + "|" +
                action + "|" +
                (entityId != null ? entityId : "") + "|" +
                timestamp + "|" +
                (ip != null ? ip : "");
        return computeSha256(input.getBytes(StandardCharsets.UTF_8));
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}

