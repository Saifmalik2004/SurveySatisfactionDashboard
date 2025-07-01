package com.example.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.dashboard.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}
