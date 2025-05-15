package com.sadetech.fundraiser.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Input can't be blank")
    private String input;
}
