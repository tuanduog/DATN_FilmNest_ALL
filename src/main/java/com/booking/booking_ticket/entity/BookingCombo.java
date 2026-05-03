package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.BookingComboType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "booking_combo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingCombo extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "booking_id")
    Booking booking;

    @ManyToOne
    @JoinColumn(name = "combo_id")
    Combo combo;

    @Enumerated(EnumType.STRING)
    BookingComboType type;

    Integer quantity;

    Double price;
}
