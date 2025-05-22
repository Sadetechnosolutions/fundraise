package com.sadetech.fundraiser.dto;

import com.sadetech.fundraiser.model.Status;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BasicInfoDto1 {
    private Long id;
    private Long userId;
    private String patientImage;
    private String patientAge;
    private String patientName;
    private String relationWithPatient;
    private String patientAddress;
    private String contactDetails;
    private Status status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}