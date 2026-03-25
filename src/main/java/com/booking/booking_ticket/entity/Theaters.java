package com.booking.booking_ticket.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "theaters")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Theaters extends BaseEntity {

    @Column(name = "theater_name", nullable = false)
    private String theaterName;

    @Column(name = "location", nullable = false)
    private String theaterLocation;
}
