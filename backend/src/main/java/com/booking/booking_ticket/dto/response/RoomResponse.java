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

    Integer theaterId;

    Status status;

    SeatResponse[] seats;

    public RoomResponse(Integer id, String name, Integer capacity, Integer totalRow, Integer totalColumn, RoomType type, String theaterName, Status status) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.totalRow = totalRow;
        this.totalColumn = totalColumn;
        this.type = type;
        this.theaterName = theaterName;
        this.status = status;
    }
}
