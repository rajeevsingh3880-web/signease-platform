package com.esign.platform.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class CreateSigningRequestDto {
    private UUID documentId;
    private String title;
    private String message;
    private LocalDate dueDate;
    private Boolean sequentialSigning = false;
    private List<SignerDto> signers = new ArrayList<>();
    private List<FieldPlacementDto> fields = new ArrayList<>();
}

