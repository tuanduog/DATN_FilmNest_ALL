package com.booking.booking_ticket.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "movie")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Movie extends BaseEntity {

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "trailer_url", nullable = false)
    private String trailerUrl;

    @Column(name = "movie_name", nullable = false)
    private String movieName;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String movieDescription;

    @Column(name = "director", nullable = false)
    private String director;

    @Column(name = "cast", nullable = false)
    private String cast;

    @Column(name = "genre", nullable = false)
    private String genre;

    @Column(name = "duration", nullable = false)
    private String duration;

    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "showing", nullable = false)
    private String showing;

    @Column(name = "date_show", nullable = false)
    private int dateShow;

    @OneToMany(mappedBy = "movie")
    @ToString.Exclude
    private Set<Ranking> setRank = new HashSet();

    @OneToMany(mappedBy = "movie")
    @ToString.Exclude
    private Set<Cart> setCart = new HashSet();

    @OneToMany(mappedBy = "movie")
    @ToString.Exclude
    private Set<Comment> setComments = new HashSet();
}
