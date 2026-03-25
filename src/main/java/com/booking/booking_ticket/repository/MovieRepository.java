package com.booking.booking_ticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.booking.booking_ticket.entity.Movie;
import org.springframework.stereotype.Repository;


@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer>{
    Movie findAllById(Integer movieId);
}
