package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.ShowingStatus;
import com.booking.booking_ticket.utils.Status;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieResponse {

    Integer id;

    String image;

    String trailerUrl;

    String name;

    String description;

    String director;

    String actor;

    String genre;

    Integer duration;

    LocalDate releaseDate;

    ShowingStatus showingStatus;

    LocalDate endDate;

    Status status;

    public MovieResponse(Integer id, String image, String name, String director, String genre, Integer duration, LocalDate releaseDate, ShowingStatus showingStatus, Status status, LocalDate endDate) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.director = director;
        this.genre = genre;
        this.duration = duration;
        this.releaseDate = releaseDate;
        this.showingStatus = showingStatus;
        this.status = status;
        this.endDate = endDate;
    }
}
