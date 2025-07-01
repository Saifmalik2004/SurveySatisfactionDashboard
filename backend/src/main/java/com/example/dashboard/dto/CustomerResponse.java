package com.example.dashboard.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CustomerResponse {
    private int id;
    private String customerName;
    private String location;
    private LocalDate visitDate;
}