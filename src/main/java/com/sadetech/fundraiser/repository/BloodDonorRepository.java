package com.sadetech.fundraiser.repository;

import com.sadetech.fundraiser.model.BloodDonor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodDonorRepository extends JpaRepository<BloodDonor, Long> {
    BloodDonor findByUserId(long userId);
}
