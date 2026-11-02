package com.esign.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldPlacementDto {
    private Integer page;
    private String type; // SIGNATURE, DATE, TEXT, CHECKBOX
    private String label;
    private Float x;
    private Float y;
    private Float width;
    private Float height;
    private String signerEmail;
}

