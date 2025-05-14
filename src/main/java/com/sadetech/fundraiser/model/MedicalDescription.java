package com.sadetech.fundraiser.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class MedicalDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descriptionHeading;
    private String medicalHistoryAndDetails;
    @ElementCollection
    private List<String> reportsImages;

    @OneToOne
    @JoinColumn(name = "basic_info_id")
    private BasicInfo basicInfo;

}
