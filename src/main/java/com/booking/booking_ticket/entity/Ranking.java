package com.booking.booking_ticket.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ranking")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ranking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(name = "rank", nullable = false)
    private Integer rank;
}
