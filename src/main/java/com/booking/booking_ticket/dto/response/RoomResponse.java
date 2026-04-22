package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.RoomType;
import com.booking.booking_ticket.utils.Status;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponse {

    Integer id;

    String name;

    Integer capacity;

    Integer totalRow;

    Integer totalColumn;

    RoomType type;

    String theaterName;

    Status status;
}
