package com.sadetech.fundraiser.dto;

import lombok.Data;

@Data
public class PatientRequestDto {
    private BasicInfoDto basicInfo;
    private CauseDto cause;
    private DescriptionDto description;
}
