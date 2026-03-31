package com.booking.booking_ticket.entity;

import java.time.LocalDate;

import com.booking.booking_ticket.utils.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "booking")
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

    @Column(name = "date", nullable = false)
    LocalDate date;

    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id")
    ShowTime showTime;
}
