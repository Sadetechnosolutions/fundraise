package com.sadetech.fundraiser.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerificationRequest {
    @NotBlank(message = "Input can't be blank")
    private String input;
    @NotBlank(message = "OTP can't be blank")
    private String otp;
}
