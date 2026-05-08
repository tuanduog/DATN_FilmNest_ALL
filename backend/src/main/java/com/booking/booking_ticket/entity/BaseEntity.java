package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.Status;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

    @Enumerated(EnumType.STRING)
    Status status;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;
}
