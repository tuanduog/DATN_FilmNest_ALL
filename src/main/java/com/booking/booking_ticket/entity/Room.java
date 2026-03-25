package com.booking.booking_ticket.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "room")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room extends BaseEntity {

    @Column(name = "room_name", nullable = false)
    private String roomName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Theater theater;
}
