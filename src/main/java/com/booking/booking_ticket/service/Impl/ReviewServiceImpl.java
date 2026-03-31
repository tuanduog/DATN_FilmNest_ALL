package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.entity.Review;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.repository.ReviewRepository;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Override
    public Review updateOrCreateReviews(Integer movieId, Integer userId, Integer newPoint){
        return reviewRepository.findByMovie_IdAndUser_Id(movieId, userId)
                .map(review -> {
                    review.setPoint(newPoint);
                    review.setUpdatedAt(Instant.now());
                    return reviewRepository.save(review);
                }).orElseGet(() -> {
                    Review newReviews = new Review();
                    newReviews.setPoint(newPoint);
                    newReviews.setCreatedAt(Instant.now());
                    newReviews.setUpdatedAt(Instant.now());

                    Users user = usersRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User không tồn tại"));
                    Movie movie = movieRepository.findById(movieId)
                            .orElseThrow(() -> new RuntimeException("Movie không tồn tại"));

                    newReviews.setUser(user);
                    newReviews.setMovie(movie);
                    return reviewRepository.save(newReviews);
                });
    }

    @Override
    public Review getReview(Integer movieId, Integer userId){
        Optional<Review> review = reviewRepository.findByMovie_IdAndUser_Id(movieId, userId);
        if(review.isPresent()){
            return review.get();
        }
        return null;
    }

    @Override
    public List<Object[]> getTop5Movies(){
        return reviewRepository.findTop10MoviesByAverageRating(PageRequest.of(0, 5));
    }
}
