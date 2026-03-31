package com.booking.booking_ticket.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@MappedSuperclass
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    int status;

    @Column(name = "created_at", nullable = false)
    private Instant created_at;

    @Column(name = "updated_at", nullable = false)
    private Instant updated_at;
}
