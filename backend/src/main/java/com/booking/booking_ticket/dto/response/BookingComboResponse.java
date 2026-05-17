package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.entity.Combo;
import com.booking.booking_ticket.utils.BookingComboType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingComboResponse {

    int id;

    Combo combo;

    BookingComboType type;

    Integer quantity;

    Double price;
}
