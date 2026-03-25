package com.booking.booking_ticket.dto;

import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingSimpleDTO {

    Integer bookingId;

    String chair;

    Double totalPrice;
    
    String combo;

    LocalDate date;

    Integer userId;

    Integer showTimeId;
}
