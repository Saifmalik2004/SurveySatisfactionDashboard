package com.example.dashboard.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.example.dashboard.dto.CustomerResponse;
import com.example.dashboard.dto.SurveyRequest;
import com.example.dashboard.dto.SurveyResponseDto;
import com.example.dashboard.model.Customer;
import com.example.dashboard.model.SurveyResponse;
import com.example.dashboard.repository.CustomerRepository;
import com.example.dashboard.repository.SurveyResponseRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/survey")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development; restrict in prod
public class SurveyController {

    private final CustomerRepository customerRepository;
    private final SurveyResponseRepository surveyResponseRepository;

    // POST - Submit survey
    @PostMapping
    public ResponseEntity<?> submitSurvey(@Valid @RequestBody SurveyRequest request) {
        Customer customer = Customer.builder()
                .customerName(request.getCustomerName())
                .location(request.getLocation())
                .visitDate(LocalDate.now())
                .build();

        Customer savedCustomer = customerRepository.save(customer);

        SurveyResponse response = SurveyResponse.builder()
                .customer(savedCustomer)
                .foodQuality(request.getFoodQuality())
                .serviceSpeed(request.getServiceSpeed())
                .staffFriendliness(request.getStaffFriendliness())
                .cleanliness(request.getCleanliness())
                .valueForMoney(request.getValueForMoney())
                .ambiance(request.getAmbiance())
                .overallRating(BigDecimal.valueOf(request.getOverallRating()))
                .comments(request.getComments())
                .build();

        surveyResponseRepository.save(response);

        return ResponseEntity.ok("Survey submitted successfully!");
    }

    // GET - All customers (no pagination)
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();

        List<CustomerResponse> responseList = customers.stream().map(customer -> {
            CustomerResponse response = new CustomerResponse();
            response.setId(customer.getId());
            response.setCustomerName(customer.getCustomerName());
            response.setLocation(customer.getLocation());
            response.setVisitDate(customer.getVisitDate());
            return response;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    // GET - All survey responses (no pagination)
    @GetMapping("/responses")
    public ResponseEntity<List<SurveyResponseDto>> getAllSurveyResponses() {
        List<SurveyResponse> surveyResponses = surveyResponseRepository.findAll();

        List<SurveyResponseDto> responseList = surveyResponses.stream().map(survey -> {
            SurveyResponseDto dto = new SurveyResponseDto();
            dto.setId(survey.getId());
            dto.setCustomerId(survey.getCustomer().getId());
            dto.setCustomerName(survey.getCustomer().getCustomerName());
            dto.setLocation(survey.getCustomer().getLocation());
            dto.setVisitDate(survey.getCustomer().getVisitDate().toString());
            dto.setFoodQuality(survey.getFoodQuality());
            dto.setServiceSpeed(survey.getServiceSpeed());
            dto.setStaffFriendliness(survey.getStaffFriendliness());
            dto.setCleanliness(survey.getCleanliness());
            dto.setValueForMoney(survey.getValueForMoney());
            dto.setAmbiance(survey.getAmbiance());
            dto.setOverallRating(survey.getOverallRating());
            dto.setComments(survey.getComments());
            dto.setCreatedAt(survey.getCreatedAt().toString());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }
}
