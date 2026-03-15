package com.booking.booking_ticket.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingSimpleDTO {
    private Integer bookingId;
    private String chair;
    private Double totalPrice;
    private String combo;
    private LocalDate date;
    private Integer userId;
    private Integer showTimeId;
}
