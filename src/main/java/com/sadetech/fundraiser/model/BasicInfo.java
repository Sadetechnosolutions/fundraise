package com.sadetech.fundraiser.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

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
    @Enumerated(EnumType.STRING)
    private Status status;
    private String message;
    @CreationTimestamp
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "basicInfo", cascade = CascadeType.ALL)
    private Cause cause;

    @OneToOne(mappedBy = "basicInfo", cascade = CascadeType.ALL)
    private MedicalDescription description;
}
