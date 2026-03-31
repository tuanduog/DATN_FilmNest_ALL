package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.MovieRequest;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import com.booking.booking_ticket.dto.response.PageResponse;
import com.booking.booking_ticket.entity.Movie;

import java.util.List;

public interface MovieService {

    List<String> getGenres();

    List<Movie> getAllMovies();

    PageResponse<?> getProductsWithMultipleSearchingColumns(int pageNo, int pageSize, String sortBy, String... search);

    public int addMovie(MovieRequest movieRequest);

    public int editMovie(int id, MovieRequest movieRequest);

    public int deleteMovie(int id);

    public List<MoviesWithRevenuesResponse> getTopMovies();

    public Movie getMovieById(int id);
}
