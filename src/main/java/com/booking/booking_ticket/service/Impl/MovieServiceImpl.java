package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.MovieRequest;
import com.booking.booking_ticket.dto.response.MovieResponse;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.service.MovieService;
import com.booking.booking_ticket.utils.ShowingStatus;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public Page<MovieResponse> getList(Pageable pageable, String keyword, ShowingStatus showingStatus, Status status){
        if (keyword != null) {
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return movieRepository.findAllByKeyword(pageable, keyword, showingStatus, status);
    }

    @Override
    public MovieResponse getById(Integer id){
        Movie movie = movieRepository.findById(id).orElseThrow(() -> new RuntimeException("Movie does not exists"));

        MovieResponse response = new MovieResponse();
        response.setId(movie.getId());
        response.setImage(movie.getImage());
        response.setName(movie.getName());
        response.setGenre(movie.getGenre());
        response.setDirector(movie.getDirector());
        response.setDuration(movie.getDuration());
        response.setActor(movie.getActor());
        response.setDescription(movie.getDescription());
        response.setReleaseDate(movie.getReleaseDate());
        response.setEndDate(movie.getEndDate());
        response.setShowingStatus(movie.getShowingStatus());
        response.setTrailerUrl(movie.getTrailerUrl());
        response.setStatus(movie.getStatus());

        return response;
    }

    @Override
    public void addMovie(MovieRequest request) {
        Optional<Movie> m = movieRepository.validateByName(request.getName(), null);
        if (m.isPresent()) {
            throw new RuntimeException("This movie already exists");
        }
        Movie movie = new Movie();
        movie.setActor(request.getActor());
        movie.setDescription(request.getDescription());
        movie.setGenre(request.getGenre());
        movie.setImage(request.getImage());
        movie.setName(request.getName());
        movie.setEndDate(request.getEndDate());
        movie.setDuration(request.getDuration());
        movie.setDirector(request.getDirector());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setShowingStatus(request.getShowingStatus());
        movie.setStatus(Status.ACTIVE);
        movie.setShowingStatus(ShowingStatus.COMING_SOON);

        movieRepository.save(movie);
    }

    @Override
    public void updateMovie(Integer id, MovieRequest request) {
        Movie m = movieRepository.findById(id).get();

        Optional<Movie> movie = movieRepository.validateByName(request.getName(), id);
        if(movie.isPresent()){
            throw new RuntimeException("This movie already exists");
        }
        if (request.getName() != null) {
            m.setName(request.getName());
        }

        if (request.getGenre() != null) {
            m.setGenre(request.getGenre());
        }

        if (request.getImage() != null) {
            m.setImage(request.getImage());
        }

        if (request.getEndDate() != null) {
            m.setEndDate(request.getEndDate());
        }

        if (request.getDuration() != null) {
            m.setDuration(request.getDuration());
        }

        if (request.getDirector() != null) {
            m.setDirector(request.getDirector());
        }

        if (request.getReleaseDate() != null) {
            m.setReleaseDate(request.getReleaseDate());
        }

        if (request.getDescription() != null) {
            m.setDescription(request.getDescription());
        }

        if (request.getShowingStatus() != null) {
            m.setShowingStatus(request.getShowingStatus());
        }

        if (request.getTrailerUrl() != null) {
            m.setTrailerUrl(request.getTrailerUrl());
        }

        if (request.getActor() != null) {
            m.setActor(request.getActor());
        }
        movieRepository.save(m);
    }

    @Override
    public void deleteMovie(Integer id) {
        Optional<Movie> movie = movieRepository.findById(id);
        if (movie.isPresent()) {
            movie.get().setStatus(Status.INACTIVE);
            movieRepository.save(movie.get());
        }
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
