package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.MovieRequestDTO;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponseDTO;
import com.booking.booking_ticket.dto.response.PageResponse;
import com.booking.booking_ticket.entity.Movie;

import java.util.List;

public interface MovieService {

    List<String> getGenres();

    List<Movie> getAllMovies();

    PageResponse<?> getProductsWithMultipleSearchingColumns(int pageNo, int pageSize, String sortBy, String... search);

    public int addMovie(MovieRequestDTO movieRequestDTO);

    public int editMovie(int id, MovieRequestDTO movieRequestDTO);

    public int deleteMovie(int id);

    public List<MoviesWithRevenuesResponseDTO> getTopMovies();

    public Movie getMovieById(int id);
}
