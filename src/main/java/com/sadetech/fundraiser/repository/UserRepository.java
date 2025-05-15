package com.sadetech.fundraiser.repository;

import com.sadetech.fundraiser.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.email = :emailOrPhone OR u.phoneNumber = :emailOrPhone")
    Optional<User> findByEmailOrPhoneNumber(@Param("emailOrPhone") String emailOrPhone);

    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> findByEmail(String email);
}
