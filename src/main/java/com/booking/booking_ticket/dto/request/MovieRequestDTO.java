package com.booking.booking_ticket.dto.request;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieRequestDTO  implements Serializable {

    String image;

    String trailerUrl;

    String movieName;

    String movieDescription;

    String director;

    String cast;

    String genre;

    String duration;

    LocalDate releaseDate;

    String showing;

    int dateShow;
}
