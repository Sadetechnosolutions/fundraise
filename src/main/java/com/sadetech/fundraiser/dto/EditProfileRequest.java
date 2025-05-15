package com.sadetech.fundraiser.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class EditProfileRequest {
    @NotNull(message = "User id can't be null")
    private Long userId;
    private String firstName;
    private String lastName;
    private String fullName;
}
