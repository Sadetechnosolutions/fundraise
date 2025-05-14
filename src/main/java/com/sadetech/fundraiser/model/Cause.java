package com.sadetech.fundraiser.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Cause {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cause;
    private double amount;
    private String hospitalName;
    private String hospitalAddress;
    private String hospitalContactDetails;
    private String medication;

    @OneToOne
    @JoinColumn(name = "basic_info_id")
    private BasicInfo basicInfo;
}
