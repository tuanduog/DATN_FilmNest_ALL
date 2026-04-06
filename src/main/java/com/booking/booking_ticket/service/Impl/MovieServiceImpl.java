package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.MovieRequest;
import com.booking.booking_ticket.dto.response.MovieResponse;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

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
    public Page<MovieResponse> getList(Pageable pageable, String keyword, String genre, Integer status){
        if (keyword != null) {
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        if (genre != null) {
            genre = "%" + genre.trim().toLowerCase() + "%";
        } else {
            genre = "%";
        }

        return movieRepository.findAllByKeyword(pageable, keyword, genre, status);
    }

    @Override
    public int addMovie(MovieRequest movieRequest) {
        Movie movie = new Movie();
        movie.setActor(movieRequest.getActor());
        movie.setDescription(movieRequest.getMovieDescription());
        movie.setGenre(movieRequest.getGenre());
        movie.setImage(movieRequest.getImage());
        movie.setName(movieRequest.getMovieName());
        movie.setEndDate(movieRequest.getEndDate());
        movie.setDuration(movieRequest.getDuration());
        movie.setDirector(movieRequest.getDirector());
        movie.setReleaseDate(movieRequest.getReleaseDate());
        movie.setShowingStatus(movieRequest.getShowingStatus());

        movieRepository.save(movie);
        return movie.getId();
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
        m.setActor(movieRequest.getActor());
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
