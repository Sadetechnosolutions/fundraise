package com.sadetech.fundraiser.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class BasicInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String patientImage;
    private String patientAge;
    private String patientName;
    private String relationWithPatient;
    private String patientAddress;
    private String contactDetails;
    @CreationTimestamp
    private String createdAt;

    @OneToOne(mappedBy = "basicInfo", cascade = CascadeType.ALL)
    private Cause cause;

    @OneToOne(mappedBy = "basicInfo", cascade = CascadeType.ALL)
    private MedicalDescription description;
}
