package com.booking.booking_ticket.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.entity.Review;
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

    public Review updateOrCreateReviews(Integer movieId, Integer userId, Integer newPoint){
        return reviewsRepository.findByMovie_IdAndUser_Id(movieId, userId)
        .map(review -> {
            review.setPoint(newPoint);
            review.setUpdated_at(Instant.now());
            return reviewsRepository.save(review);
        }).orElseGet(() -> {
            Review newReviews = new Review();
            newReviews.setPoint(newPoint);
            newReviews.setCreated_at(Instant.now());
            newReviews.setUpdated_at(Instant.now());
            
            Users user = usersRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));
            Movie movie = movieRepository.findById(movieId)
                    .orElseThrow(() -> new RuntimeException("Movie không tồn tại"));

            newReviews.setUser(user);
            newReviews.setMovie(movie);
            return reviewsRepository.save(newReviews);
        });
    }

    public Review getReview(Integer movieId, Integer userId){
        Optional<Review> review = reviewsRepository.findByMovie_IdAndUser_Id(movieId, userId);
        if(review.isPresent()){
            return review.get();
        }
        return null;
    }

    public List<Object[]> getTop5Movies(){
        return reviewsRepository.findTop10MoviesByAverageRating(PageRequest.of(0, 5));
    }
}
