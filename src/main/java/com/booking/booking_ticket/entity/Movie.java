package com.booking.booking_ticket.entity;


import com.booking.booking_ticket.utils.ShowingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "movie")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Movie extends BaseEntity {

    @Column(name = "image", nullable = false)
    String image;

    @Column(name = "trailer_url", nullable = false)
    String trailerUrl;

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    String description;

    @Column(name = "director", nullable = false)
    String director;

    @Column(name = "cast", nullable = false)
    String cast;

    @Column(name = "genre", nullable = false)
    String genre;

    @Column(name = "duration", nullable = false)
    Integer duration;

    @Column(name = "release_date", nullable = false)
    LocalDate releaseDate;

    @Column(name = "showing_status", nullable = false)
    @Enumerated(EnumType.STRING)
    ShowingStatus showingStatus;

    @Column(name = "end_date", nullable = false)
    LocalDate endDate;

    @OneToMany(mappedBy = "movie")
    @ToString.Exclude
    Set<Ranking> setRank = new HashSet();

    @OneToMany(mappedBy = "movie")
    @ToString.Exclude
    Set<Comment> setComments = new HashSet();
}
