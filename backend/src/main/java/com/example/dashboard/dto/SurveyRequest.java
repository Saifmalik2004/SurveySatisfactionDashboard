package com.example.dashboard.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SurveyRequest {

    @NotBlank
    private String customerName;

    @NotBlank
    private String location;

    @NotBlank
    private String foodQuality;

    @NotBlank
    private String serviceSpeed;

    @NotBlank
    private String staffFriendliness;

    @NotBlank
    private String cleanliness;

    @NotBlank
    private String valueForMoney;

    @NotBlank
    private String ambiance;

    @NotNull
    @DecimalMin("1.0")
    @DecimalMax("5.0")
    private Double overallRating;

    private String comments;
}
