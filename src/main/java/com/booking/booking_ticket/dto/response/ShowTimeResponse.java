package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimeResponse {

    Integer id;

    LocalDate showDate;

    LocalTime startTime;

    Double surcharge;

    String movieName;

    Integer movieId;

    String theaterName;

    Integer theaterId;

    String roomName;

    Integer roomId;

    Status status;

    public ShowTimeResponse(Integer id, LocalDate showDate, LocalTime startTime, String movieName, String theaterName, String roomName, Status status) {
        this.id = id;
        this.showDate = showDate;
        this.startTime = startTime;
        this.movieName = movieName;
        this.theaterName = theaterName;
        this.roomName = roomName;
        this.status = status;
    }

    public ShowTimeResponse(Integer id, LocalDate showDate, LocalTime startTime){
        this.id = id;
        this.showDate = showDate;
        this.startTime = startTime;
    }
}
