package com.booking.booking_ticket.dto;

import com.booking.booking_ticket.utils.RoomType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomDTO {

    Integer roomId;

    String roomName;

    Integer capacity;

    RoomType roomType;
}
