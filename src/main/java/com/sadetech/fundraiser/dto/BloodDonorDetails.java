package com.sadetech.fundraiser.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BloodDonorDetails {

        private Long userId;
        @NotBlank(message = "Full name can't be blank")
        private String fullName;
        @NotBlank(message = "Phone number can't be blank")
        private String phoneNumber;
        @NotBlank(message = "Email can't be blank")
        private String email;
        @NotBlank(message = "Blood Group details can't be blank")
        private String bloodGroup;
        private String alternateMobileNumber;
        @NotBlank(message = "Country can't be blank")
        private String country;
        @NotBlank(message = "State can't be blank")
        private String state;
        @NotBlank(message = "District can't be blank")
        private String district;
        @NotBlank(message = "City can't be blank")
        private String city;
        private String townOrVillage;
        @NotBlank(message = "Pin code can't be blank")
        private String pinCode;

}
