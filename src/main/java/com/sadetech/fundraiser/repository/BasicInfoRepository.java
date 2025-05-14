package com.sadetech.fundraiser.repository;

import com.sadetech.fundraiser.model.BasicInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BasicInfoRepository extends JpaRepository<BasicInfo, Long> {
    List<BasicInfo> findByUserId(Long userId);

}
