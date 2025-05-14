package com.sadetech.fundraiser.dto;

import lombok.Data;

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
    private String createdAt;
    private CauseDto cause;
    private DescriptionDto description;
}