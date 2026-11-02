package com.esign.platform.dto;

import lombok.Data;

@Data
public class SubmitSignatureDto {
    private String signatureData; // Base64 data URL
    private String signatureType; // DRAWN, TYPED, UPLOADED, AADHAAR_ESIGN
    private String typedName;
    private String typedFont;
    private Boolean consentAccepted;
    private String otpCode;
    private String aadhaarNumber;
    private String aadhaarOtp;
}

