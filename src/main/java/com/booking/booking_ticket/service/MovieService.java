package com.booking.booking_ticket.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.booking.booking_ticket.entity.Movies;
import com.booking.booking_ticket.repository.MovieRepository;

@Service
public class MovieService {
    @Autowired
    private MovieRepository movieRepository;

    public List<Movies> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movies getMovieById(int id) {
        return movieRepository.findAllById(id);
    }
}
