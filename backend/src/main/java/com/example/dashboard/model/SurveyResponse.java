package com.example.dashboard.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "survey_responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyResponse extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull(message = "Customer is required")
    private Customer customer;

    @NotBlank(message = "Food quality is required")
    @Column(name = "food_quality", nullable = false, length = 20)
    private String foodQuality;

    @NotBlank(message = "Service speed is required")
    @Column(name = "service_speed", nullable = false, length = 20)
    private String serviceSpeed;

    @NotBlank(message = "Staff friendliness is required")
    @Column(name = "staff_friendliness", nullable = false, length = 20)
    private String staffFriendliness;

    @NotBlank(message = "Cleanliness is required")
    @Column(nullable = false, length = 20)
    private String cleanliness;

    @NotBlank(message = "Value for money is required")
    @Column(name = "value_for_money", nullable = false, length = 20)
    private String valueForMoney;

    @NotBlank(message = "Ambiance is required")
    @Column(nullable = false, length = 20)
    private String ambiance;

    @NotNull(message = "Overall rating is required")
    @DecimalMin(value = "1.0", message = "Minimum rating is 1.0")
    @DecimalMax(value = "5.0", message = "Maximum rating is 5.0")
    @Column(name = "overall_rating", precision = 2, scale = 1)
    private BigDecimal overallRating;

    private String comments;
}
