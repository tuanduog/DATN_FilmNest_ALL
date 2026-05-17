package com.booking.booking_ticket.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDTO {

    Integer bookingId;

    String code;

    String chair;

    Double totalPrice;

    LocalDate date;

    String movieImage;

    String movieName;

    LocalTime startTime;

    String roomName;

    String theaterName;

    String theaterLocation;

    public BookingDTO(Integer bookingId, String code, String chair, Double totalPrice,
                      LocalDate date, String movieImage, String movieName,
                      LocalTime startTime, String roomName, String theaterName,
                      String theaterLocation) {
        this.bookingId = bookingId;
        this.code = code;
        this.chair = chair;
        this.totalPrice = totalPrice;
        this.date = date;
        this.movieImage = movieImage;
        this.movieName = movieName;
        this.startTime = startTime;
        this.roomName = roomName;
        this.theaterName = theaterName;
        this.theaterLocation = theaterLocation;
    }
}

