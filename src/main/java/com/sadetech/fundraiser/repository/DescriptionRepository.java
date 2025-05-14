package com.sadetech.fundraiser.repository;

import com.sadetech.fundraiser.model.MedicalDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DescriptionRepository extends JpaRepository<MedicalDescription, Long> {}