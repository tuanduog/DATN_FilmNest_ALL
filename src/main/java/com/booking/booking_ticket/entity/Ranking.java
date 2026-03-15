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
public class Ranking {

    @Id
    @Column(name = "ranking_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rankingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private Movies movie;

    @Column(name = "rank", nullable = false)
    private Integer rank;





}
