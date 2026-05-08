package com.booking.booking_ticket.controller;

import java.util.List;

import com.booking.booking_ticket.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.booking.booking_ticket.dto.CommentDTO;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/comment")
public class CmtRestController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/v1/{movieId}")
    public ResponseEntity<?> getAllComments(@PathVariable Integer movieId) {
        try {
            List<CommentDTO> comments = commentService.getAllComment(movieId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error get comments: " + e.getMessage());
        }
    }
}
