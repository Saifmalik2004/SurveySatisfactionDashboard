package com.example.dashboard.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class SurveyResponseDto {
    private int id;
    private int customerId;
    private String customerName;
    private String visitDate;
    private String location; // Added from Customer
    private String foodQuality;
    private String serviceSpeed;
    private String staffFriendliness;
    private String cleanliness;
    private String valueForMoney;
    private String ambiance;
    private BigDecimal overallRating;
    private String comments;
    private String createdAt;
}