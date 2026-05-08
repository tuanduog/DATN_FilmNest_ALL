package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.utils.SeatStatus;
import com.booking.booking_ticket.utils.SeatType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatRequest {

    String label;

    Integer row;

    Integer col;

    Double price;

    SeatType type;

    SeatStatus seatStatus;
}
