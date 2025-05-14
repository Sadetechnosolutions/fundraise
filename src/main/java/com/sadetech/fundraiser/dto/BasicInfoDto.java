package com.sadetech.fundraiser.dto;

import lombok.Data;

@Data
public class BasicInfoDto {
    private Long userId;
    private String patientImage;
    private String patientAge;
    private String patientName;
    private String relationWithPatient;
    private String patientAddress;
    private String contactDetails;
}