package com.booking.booking_ticket.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.booking.booking_ticket.entity.Reviews;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, Integer>{
    Optional<Reviews> findByMovie_MovieIdAndUser_UserId(Integer movieId, Integer userId);

    @Query("SELECT r.movie.movieId, r.movie.image, r.movie.movieName, AVG(r.point) AS avgRating, COUNT(r.reviewId) AS reviewCount " +
           "FROM Reviews r " +
           "GROUP BY r.movie.movieId, r.movie.image, r.movie.movieName " +
           "ORDER BY avgRating DESC")
    List<Object[]> findTop10MoviesByAverageRating(org.springframework.data.domain.Pageable pageable);
}
