package com.sadetech.fundraiser.dto;

import lombok.Data;

@Data
public class VerificationRequest {
    private String phoneNumber;
    private String otp;
}
