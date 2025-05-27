package com.sadetech.fundraiser.repository;

import com.sadetech.fundraiser.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<ContactMessage,Long> {
}
