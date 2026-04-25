package com.booking.booking_ticket.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.booking.booking_ticket.utils.RoomType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimeDTO {

    Integer id;

    LocalDate showDate;

    LocalTime startTime;

    Integer roomId;

    String roomName;

    RoomType roomType;

    Integer capacity;
}
