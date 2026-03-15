package com.booking.booking_ticket.dto.request;

import jakarta.persistence.Column;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MovieRequestDTO  implements Serializable {
    private String image;
    private String trailerUrl;
    private String movieName;
    private String movieDescription;
    private String director;
    private String cast;
    private String genre;
    private String duration;
    private LocalDate releaseDate;
    private String showing;
    private int dateShow;

}
