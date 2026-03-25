package com.booking.booking_ticket.entity;

import java.time.LocalDate;

import com.booking.booking_ticket.utils.TicketStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Booking extends BaseEntity {

    @Column(name = "chair", nullable = false)
    String chair;

    @Column(name = "total_price", nullable = false)
    Double totalPrice;

    @Column(name = "combo", nullable = false)
    String combo;

    @Column(name = "date", nullable = false)
    LocalDate date;

    @Column(name = "created_at")
    LocalDateTime created_at;

    @Column(name = "ticket_status")
    @Enumerated(EnumType.STRING)
    TicketStatus ticketStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id")
    ShowTime showTime;
}
