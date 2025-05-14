package com.sadetech.fundraiser.dto;

import lombok.Data;

import java.util.List;

@Data
public class DescriptionDto {
    private String descriptionHeading;
    private String medicalHistoryAndDetails;
    private List<String> reportsImages;
}