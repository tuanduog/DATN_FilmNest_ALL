package com.booking.booking_ticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.booking.booking_ticket.entity.Movies;
import org.springframework.stereotype.Repository;


@Repository
public interface MovieRepository extends JpaRepository<Movies, Integer>{
    Movies findByMovieId(Integer movieId);
}
