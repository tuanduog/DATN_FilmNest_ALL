package com.booking.booking_ticket.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;

@Builder
@Getter
public class ShowtimeResponse {

    private Integer showTimeId;

    private LocalTime startTime;

    private String movieName;

    private Integer movieId;

    private String theaterName;

    private Integer theaterId;

    private String roomName;

    private Integer roomId;
}
