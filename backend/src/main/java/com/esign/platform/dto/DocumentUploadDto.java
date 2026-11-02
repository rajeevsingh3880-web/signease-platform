package com.esign.platform.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class DocumentUploadDto {
    private String title;
    private String description;
    private MultipartFile file;
    private LocalDate expiryDate;
    private Boolean sequentialSigning = false;
}

