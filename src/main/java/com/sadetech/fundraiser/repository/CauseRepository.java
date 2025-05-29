package com.sadetech.fundraiser.repository;

import com.sadetech.fundraiser.model.Cause;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CauseRepository extends JpaRepository<Cause, Long> {
    List<Cause> findByCause(String cause);
}
