package com.booking.booking_ticket.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.booking.booking_ticket.entity.Review;

@Repository
public interface ReviewsRepository extends JpaRepository<Review, Integer>{
    Optional<Review> findByMovie_IdAndUser_Id(Integer movieId, Integer userId);

    @Query("SELECT r.movie.id, r.movie.image, r.movie.movieName, AVG(r.point) AS avgRating, COUNT(r.id) AS reviewCount " +
           "FROM Review r " +
           "GROUP BY r.movie.id, r.movie.image, r.movie.movieName " +
           "ORDER BY avgRating DESC")
    List<Object[]> findTop10MoviesByAverageRating(org.springframework.data.domain.Pageable pageable);
}
