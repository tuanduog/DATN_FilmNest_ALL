package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.MovieRequestDTO;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponseDTO;
import com.booking.booking_ticket.dto.response.PageResponse;
import com.booking.booking_ticket.entity.Movies;
import com.booking.booking_ticket.repository.MoviesRepository;
import com.booking.booking_ticket.repository.SearchRepository;
import com.booking.booking_ticket.service.MoviesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoviesServiceImpl implements MoviesService {

    private final MoviesRepository moviesRepository;
    private final SearchRepository searchRepository;

    @Override
    public List<String> getGenres() {
        List<String> genres = moviesRepository.collectGenre().stream().toList();

        return genres;
    }

    @Override
    public List<Movies> getAllMovies() {
        return moviesRepository.findAll();
    }

    @Override
    public PageResponse<?> getProductsWithMultipleSearchingColumns(int pageNo, int pageSize, String sortBy, String... search) {
        return searchRepository.searchingProductWithMultipleColumns(pageNo,pageSize,sortBy,search) ;
    }

    @Override
    public int addMovie(MovieRequestDTO movieRequestDTO) {
        Movies v = Movies.builder()
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
        moviesRepository.save(
                v
        );

        return v.getMovieId();
    }

    @Override
    public int editMovie(int id, MovieRequestDTO movieRequestDTO) {
        Movies m = moviesRepository.findById(id).get();

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
        moviesRepository.save(m);
        return m.getMovieId();
    }

    @Override
    public int deleteMovie(int id) {
        moviesRepository.deleteById(id);
        return id;
    }

    @Override
    public List<MoviesWithRevenuesResponseDTO> getTopMovies() {
        return moviesRepository.topMovies();
    }


}
