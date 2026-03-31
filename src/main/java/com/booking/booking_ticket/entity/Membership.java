package com.booking.booking_ticket.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "membership")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Membership extends BaseEntity{

    private String name;

    private String type;

    private Double price;

    private Integer discount;

    @Column(name = "duration", nullable = false, columnDefinition = "TEXT")
    private Integer duration;

    private String description;
}
