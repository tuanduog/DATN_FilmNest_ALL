package com.booking.booking_ticket.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BookingDTO {
    private Integer bookingId;
    private String chair;
    private Double totalPrice;
    private String combo;
    private LocalDate date;
    private String movieImage;
    private String movieName;
    private LocalTime startTime;
    private String roomName;
    private String theaterName;
    private String theaterLocation;

    // Constructor Hibernate cần
    public BookingDTO(Integer bookingId, String chair, Double totalPrice, String combo,
                      LocalDate date, String movieImage, String movieName,
                      LocalTime startTime, String roomName, String theaterName,
                      String theaterLocation) {
        this.bookingId = bookingId;
        this.chair = chair;
        this.totalPrice = totalPrice;
        this.combo = combo;
        this.date = date;
        this.movieImage = movieImage;
        this.movieName = movieName;
        this.startTime = startTime;
        this.roomName = roomName;
        this.theaterName = theaterName;
        this.theaterLocation = theaterLocation;
    }
}

