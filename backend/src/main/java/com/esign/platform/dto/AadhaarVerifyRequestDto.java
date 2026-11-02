package com.esign.platform.dto;

import lombok.Data;

@Data
public class AadhaarVerifyRequestDto {
    private String aadhaarNumber;
    private String otpCode;
}

