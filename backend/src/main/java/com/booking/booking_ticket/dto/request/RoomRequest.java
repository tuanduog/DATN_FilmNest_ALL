package com.booking.booking_ticket.dto.request;

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
public class RoomRequest {

    String name;

    Integer capacity;

    Integer totalRow;

    Integer totalColumn;

    RoomType type;

    Integer theaterId;

    SeatRequest[] seats;
}
