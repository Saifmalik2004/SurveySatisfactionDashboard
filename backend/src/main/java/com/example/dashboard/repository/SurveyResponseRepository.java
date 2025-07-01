package com.example.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.dashboard.model.SurveyResponse;

public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Integer> {
}