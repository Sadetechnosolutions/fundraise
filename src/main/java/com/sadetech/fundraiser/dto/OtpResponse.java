package com.sadetech.fundraiser.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OtpResponse {
    private Long id;
    private String phoneNumber;
    private String otp;
    private String otpType;
    private LocalDateTime createdAt;
}
