package com.sadetech.fundraiser.dto;

import lombok.Data;

@Data
public class CauseDto {
    private String cause;
    private double amount;
    private String hospitalName;
    private String hospitalAddress;
    private String hospitalContactDetails;
    private String medication;
}