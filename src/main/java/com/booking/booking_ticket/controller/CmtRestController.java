package com.booking.booking_ticket.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.booking.booking_ticket.dto.CommentDTO;
import com.booking.booking_ticket.entity.Movies;
import com.booking.booking_ticket.service.CommentService;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/comments")
public class CmtRestController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/getAll-Comments/{movieId}")
    public ResponseEntity<?> getAllComments(@PathVariable Integer movieId) {
        try {
            List<CommentDTO> cmts = commentService.getAllComment(movieId);
            return ResponseEntity.ok(cmts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error get comments: " + e.getMessage());
        }
    }
}
