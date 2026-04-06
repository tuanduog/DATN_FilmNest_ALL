package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.MovieResponse;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.MovieResponse(m.image, m.name, m.director, m.genre, m.duration, m.releaseDate, m.showingStatus, m.endDate)
        FROM Movie m
        WHERE (LOWER(m.name) LIKE :keyword OR LOWER(m.director) LIKE :keyword)
        AND (:status IS NULL OR m.showingStatus = :status)
        AND (LOWER(m.genre) LIKE :genre)
    """)
    Page<MovieResponse> findAllByKeyword(Pageable pageable, String keyword, String genre, Integer status);
}
