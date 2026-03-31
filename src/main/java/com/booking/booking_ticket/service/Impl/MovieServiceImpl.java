package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.MovieRequest;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import com.booking.booking_ticket.dto.response.PageResponse;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.repository.SearchRepository;
import com.booking.booking_ticket.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    private final SearchRepository searchRepository;

    @Override
    public List<String> getGenres() {
        List<String> genres = movieRepository.collectGenre().stream().toList();

        return genres;
    }

    @Override
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @Override
    public PageResponse<?> getProductsWithMultipleSearchingColumns(int pageNo, int pageSize, String sortBy, String... search) {
        return searchRepository.searchingProductWithMultipleColumns(pageNo,pageSize,sortBy,search) ;
    }

    @Override
    public int addMovie(MovieRequest movieRequest) {
        Movie v = Movie.builder()
                .cast(movieRequest.getCast())
                .description(movieRequest.getMovieDescription())
                .genre(movieRequest.getGenre())
                .image(movieRequest.getImage())
                .name(movieRequest.getMovieName())
                .endDate(movieRequest.getEndDate())
                .duration(movieRequest.getDuration())
                .director(movieRequest.getDirector())
                .releaseDate(movieRequest.getReleaseDate())
                .showingStatus(movieRequest.getShowingStatus())
                .build();
        movieRepository.save(v);

        return v.getId();
    }

    @Override
    public int editMovie(int id, MovieRequest movieRequest) {
        Movie m = movieRepository.findById(id).get();

        m.setDescription(movieRequest.getMovieDescription());
        m.setGenre(movieRequest.getGenre());
        m.setImage(movieRequest.getImage());
        m.setName(movieRequest.getMovieName());
        m.setEndDate(movieRequest.getEndDate());
        m.setDuration(movieRequest.getDuration());
        m.setDirector(movieRequest.getDirector());
        m.setReleaseDate(movieRequest.getReleaseDate());
        m.setShowingStatus(movieRequest.getShowingStatus());
        m.setTrailerUrl(movieRequest.getTrailerUrl());
        m.setCast(movieRequest.getCast());
        movieRepository.save(m);
        return m.getId();
    }

    @Override
    public int deleteMovie(int id) {
        movieRepository.deleteById(id);
        return id;
    }

    @Override
    public List<MoviesWithRevenuesResponse> getTopMovies() {
        return movieRepository.topMovies();
    }

    @Override
    public Movie getMovieById(int id) {
        return movieRepository.findAllById(id);
    }
}
