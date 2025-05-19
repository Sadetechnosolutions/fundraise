package com.sadetech.fundraiser.repository;

import com.sadetech.fundraiser.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findFirstByPhoneNumberAndUsedFalseAndOtpTypeOrderByCreatedAtDesc(String phoneNumber, String otpType);

    Optional<Otp> findFirstByPhoneNumberAndUsedFalseOrderByCreatedAtDesc(String phoneNumber);

    Optional<Otp> findFirstByEmailAndUsedFalseOrderByCreatedAtDesc(String email);
}
