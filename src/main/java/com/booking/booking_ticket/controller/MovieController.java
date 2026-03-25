package com.booking.booking_ticket.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.service.MovieService;

@RestController
@RequestMapping("/movie")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {
    @Autowired
    private MovieService movieService;

    @GetMapping(value = "/getAll-movies", produces = "application/json")
    public ResponseEntity<?> getAllMovies() {
        List<Movie> mv = movieService.getAllMovies();
        return ResponseEntity.ok(mv);
    }

    @GetMapping("/get-movie/{id}")
    public ResponseEntity<?> getMovie(@PathVariable int id) {
        Movie mv = movieService.getMovieById(id);
        return ResponseEntity.ok(mv);
    }

}
