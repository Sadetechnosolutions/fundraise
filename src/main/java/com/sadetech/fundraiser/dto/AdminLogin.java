package com.sadetech.fundraiser.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminLogin {
    @NotBlank(message = "Email cannot be empty")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    private String password;
}
