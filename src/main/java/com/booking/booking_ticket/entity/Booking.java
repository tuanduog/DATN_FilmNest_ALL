package com.booking.booking_ticket.entity;

import java.time.LocalDate;

import com.booking.booking_ticket.utils.TicketStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @Column(name = "booking_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;

    @Column(name = "chair", nullable = false)
    private String chair;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "combo", nullable = false)
    private String combo;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TicketStatus ticketStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id")
    private Show_time showTime;
}
