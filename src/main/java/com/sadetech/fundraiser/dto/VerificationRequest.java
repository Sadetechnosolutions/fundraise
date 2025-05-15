package com.sadetech.fundraiser.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerificationRequest {
    @NotBlank(message = "Phone number can't be blank")
    private String phoneNumber;
    @NotBlank(message = "OTP can't be blank")
    private String otp;
}
