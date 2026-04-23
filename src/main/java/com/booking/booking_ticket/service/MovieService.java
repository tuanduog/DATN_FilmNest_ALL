package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.MovieRequest;
import com.booking.booking_ticket.dto.response.MovieResponse;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MovieService {

    List<String> getGenres();

    List<Movie> getAllMovies();

    Page<MovieResponse> getList(Pageable pageable, String keyword, String genre, Status status);

    public void addMovie(MovieRequest request);

    public MovieResponse getById(Integer id);

    public void updateMovie(Integer id, MovieRequest request);

    public void deleteMovie(Integer id);

    public List<MoviesWithRevenuesResponse> getTopMovies();

    public Movie getMovieById(int id);
}
