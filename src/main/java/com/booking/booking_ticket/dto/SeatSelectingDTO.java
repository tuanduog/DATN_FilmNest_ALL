package com.booking.booking_ticket.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SeatSelectingDTO {
    private Integer movieId;
    private String date;
    private Integer showTimeId;
    private Integer userId;
    private String seats;
}
