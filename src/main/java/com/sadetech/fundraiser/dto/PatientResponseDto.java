package com.sadetech.fundraiser.dto;

import lombok.Data;

@Data
public class PatientResponseDto {
    private BasicInfoDto1 basicInfo;
    private CauseDto cause;
    private DescriptionDto description;
}
