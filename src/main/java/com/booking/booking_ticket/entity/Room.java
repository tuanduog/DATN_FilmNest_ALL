package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.RoomType;
import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "room")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    private Integer capacity;

    @Column(name = "type", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private RoomType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Theater theater;
}
