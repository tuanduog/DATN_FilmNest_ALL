package com.booking.booking_ticket.service;

import com.booking.booking_ticket.entity.Review;

import java.util.List;

public interface ReviewService {

    public Review updateOrCreateReviews(Integer movieId, Integer userId, Integer newPoint);

    public Review getReview(Integer movieId, Integer userId);

    public List<Object[]> getTop5Movies();
}
