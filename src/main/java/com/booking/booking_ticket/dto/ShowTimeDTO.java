package com.booking.booking_ticket.dto;

import java.time.LocalTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimeDTO {

    Integer showTimeId;

    LocalTime startTime;

    RoomDTO roomName;
}
