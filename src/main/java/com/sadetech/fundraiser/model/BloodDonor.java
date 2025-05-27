package com.sadetech.fundraiser.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodDonor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = true)
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
