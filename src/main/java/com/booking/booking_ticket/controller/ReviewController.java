package com.booking.booking_ticket.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.booking.booking_ticket.entity.Reviews;
import com.booking.booking_ticket.service.ReviewsService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {
    @Autowired
    private ReviewsService reviewsService;

    @PutMapping("/update-Rate/{movieId}/{userId}")
    public ResponseEntity<?> updateOrCreateRate(@PathVariable Integer movieId, @PathVariable Integer userId, @RequestBody Map<String, Object> payload) {
        Integer starValue = (Integer) payload.get("starValue");
        Reviews review = reviewsService.updateOrCreateReviews(movieId, userId, starValue);

        return ResponseEntity.ok(review);
    }

    @GetMapping("/get-Review/{movieId}/{userId}")
    public ResponseEntity<?> getReview(@PathVariable Integer movieId, @PathVariable Integer userId) {
        Reviews rv = reviewsService.getReview(movieId, userId);
        if(rv != null){
            return ResponseEntity.ok(rv);
        }
        return ResponseEntity.badRequest().body("Không tìm thấy review");
    }

    @GetMapping("/get-Top5Movies")
    public ResponseEntity<?> getTop5Movies() {
        List<Object[]> top5 = reviewsService.getTop5Movies();

        return ResponseEntity.ok(top5);
    }
    
    
}
