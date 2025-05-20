package com.sadetech.fundraiser.dto;

import lombok.Data;

@Data
public class BloodDonorDetails {

    private Long userId;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String bloodGroup;
    private String alternateMobileNumber;
    private String country;
    private String state;
    private String district;
    private String city;
    private String townOrVillage;
    private String pinCode;

}
