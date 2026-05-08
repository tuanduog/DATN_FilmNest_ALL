package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.utils.ShowingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieRequest implements Serializable {

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
}
