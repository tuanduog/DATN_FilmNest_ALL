package com.booking.booking_ticket.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatSelectingDTO {

    Integer movieId;

    String date;

    Integer showTimeId;

    Integer userId;

    String seats;
}
