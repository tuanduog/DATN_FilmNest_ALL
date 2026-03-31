package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import com.booking.booking_ticket.entity.Movie;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer>{

    Movie findAllById(Integer movieId);

    @Query("Select distinct m.genre from Movie m")
    List<String> collectGenre();

    @Query("SELECT new com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse(m.name, SUM(b.totalPrice),COUNT(b),AVG(b.totalPrice)) "+
            "FROM Booking b " +
            "JOIN b.showTime st " +
            "JOIN st.movie m " +
            "GROUP BY m.name    " +
            "ORDER BY SUM(b.totalPrice) DESC")
    List<MoviesWithRevenuesResponse> topMovies();
}
