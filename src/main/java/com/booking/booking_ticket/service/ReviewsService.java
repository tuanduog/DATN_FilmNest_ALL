package com.booking.booking_ticket.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.booking.booking_ticket.entity.Movies;
import com.booking.booking_ticket.entity.Reviews;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.repository.ReviewsRepository;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.entity.Users;

@Service
public class ReviewsService {
    @Autowired
    private ReviewsRepository reviewsRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private MovieRepository movieRepository;

    public Reviews updateOrCreateReviews(Integer movieId, Integer userId, Integer newPoint){
        return reviewsRepository.findByMovie_MovieIdAndUser_UserId(movieId, userId)
        .map(review -> {
            review.setPoint(newPoint);
            review.setUpdated_at(Instant.now());
            return reviewsRepository.save(review);
        }).orElseGet(() -> {
            Reviews newReviews = new Reviews();
            newReviews.setPoint(newPoint);
            newReviews.setCreated_at(Instant.now());
            newReviews.setUpdated_at(Instant.now());
            
            Users user = usersRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));
            Movies movie = movieRepository.findById(movieId)
                    .orElseThrow(() -> new RuntimeException("Movie không tồn tại"));

            newReviews.setUser(user);
            newReviews.setMovie(movie);
            return reviewsRepository.save(newReviews);
        });
    }

    public Reviews getReview(Integer movieId, Integer userId){
        Optional<Reviews> review = reviewsRepository.findByMovie_MovieIdAndUser_UserId(movieId, userId);
        if(review.isPresent()){
            return review.get();
        }
        return null;
    }

    public List<Object[]> getTop5Movies(){
        return reviewsRepository.findTop10MoviesByAverageRating(PageRequest.of(0, 5));
    }
}
