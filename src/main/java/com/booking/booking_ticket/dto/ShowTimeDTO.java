package com.booking.booking_ticket.dto;

import java.time.LocalTime;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShowTimeDTO {
    private Integer showTimeId;
    private LocalTime startTime;
    private RoomDTO roomName;
}
