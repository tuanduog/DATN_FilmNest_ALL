package com.booking.booking_ticket.controller;

import java.util.List;
import java.util.Map;

import com.booking.booking_ticket.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.booking.booking_ticket.entity.Review;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PutMapping("/v1/{movieId}/{userId}")
    public ResponseEntity<?> updateOrCreateRate(@PathVariable Integer movieId, @PathVariable Integer userId, @RequestBody Map<String, Object> payload) {
        Integer starValue = (Integer) payload.get("starValue");
        Review review = reviewService.updateOrCreateReviews(movieId, userId, starValue);

        return ResponseEntity.ok(review);
    }

    @GetMapping("/v1/{movieId}/{userId}")
    public ResponseEntity<?> getReview(@PathVariable Integer movieId, @PathVariable Integer userId) {
        Review rv = reviewService.getReview(movieId, userId);
        if(rv != null){
            return ResponseEntity.ok(rv);
        }
        return ResponseEntity.badRequest().body("Không tìm thấy review");
    }

    @GetMapping("/v1/top")
    public ResponseEntity<?> getTop5Movies() {
        List<Object[]> top5 = reviewService.getTop5Movies();

        return ResponseEntity.ok(top5);
    }
}
