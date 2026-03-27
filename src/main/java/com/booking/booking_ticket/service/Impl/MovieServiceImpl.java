package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.MovieRequestDTO;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponseDTO;
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
    public int addMovie(MovieRequestDTO movieRequestDTO) {
        Movie v = Movie.builder()
                .cast(movieRequestDTO.getCast())
                .movieDescription(movieRequestDTO.getMovieDescription())
                .genre(movieRequestDTO.getGenre())
                .image(movieRequestDTO.getImage())
                .movieName(movieRequestDTO.getMovieName())
                .dateShow(movieRequestDTO.getDateShow())
                .duration(movieRequestDTO.getDuration())
                .director(movieRequestDTO.getDirector())
                .releaseDate(movieRequestDTO.getReleaseDate())
                .showing(movieRequestDTO.getShowing())
                .build();
        movieRepository.save(v);

        return v.getId();
    }

    @Override
    public int editMovie(int id, MovieRequestDTO movieRequestDTO) {
        Movie m = movieRepository.findById(id).get();

        m.setMovieDescription(movieRequestDTO.getMovieDescription());
        m.setGenre(movieRequestDTO.getGenre());
        m.setImage(movieRequestDTO.getImage());
        m.setMovieName(movieRequestDTO.getMovieName());
        m.setDateShow(movieRequestDTO.getDateShow());
        m.setDuration(movieRequestDTO.getDuration());
        m.setDirector(movieRequestDTO.getDirector());
        m.setReleaseDate(movieRequestDTO.getReleaseDate());
        m.setShowing(movieRequestDTO.getShowing());
        m.setTrailerUrl(movieRequestDTO.getTrailerUrl());
        m.setCast(movieRequestDTO.getCast());
        movieRepository.save(m);
        return m.getId();
    }

    @Override
    public int deleteMovie(int id) {
        movieRepository.deleteById(id);
        return id;
    }

    @Override
    public List<MoviesWithRevenuesResponseDTO> getTopMovies() {
        return movieRepository.topMovies();
    }

    @Override
    public Movie getMovieById(int id) {
        return movieRepository.findAllById(id);
    }
}
