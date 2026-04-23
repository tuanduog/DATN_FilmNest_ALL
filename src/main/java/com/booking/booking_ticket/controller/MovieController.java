package com.booking.booking_ticket.controller;

import java.util.List;

import com.booking.booking_ticket.dto.request.MovieRequest;
import com.booking.booking_ticket.dto.request.RoomRequest;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;
import com.booking.booking_ticket.service.Impl.MovieServiceImpl;
import com.booking.booking_ticket.service.MovieService;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.booking.booking_ticket.entity.Movie;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/movie")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private MovieServiceImpl moviesService;

    @GetMapping("/getGenres")
    public ResponseData<?> getGenres()
    {
        try {
            List<String> result = moviesService.getGenres();
            System.out.println(result.size());
            if(!result.isEmpty())
                return new ResponseData<>(HttpStatus.OK.value(),"Có genre",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "genre null");
        }
        catch (Exception e)
        {
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @GetMapping("/getAll")
    public ResponseData<?> getMovies()
    {
        try {
            List<Movie> result = moviesService.getAllMovies();
            System.out.println(result.size());
            if(!result.isEmpty())
                return new ResponseData<>(HttpStatus.OK.value(),"Có movies",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "movies null");
        }
        catch (Exception e)
        {
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @GetMapping("/getTopMovies")
    public ResponseData<?> getTopMovies()
    {
        try {
            List<MoviesWithRevenuesResponse> result = moviesService.getTopMovies();
            if(!result.isEmpty())
                return new ResponseData<>(HttpStatus.OK.value(),"Có movies",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "movies null");
        }
        catch (Exception e)
        {
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

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

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable,
                                   @RequestParam(required = false) String keyword,
                                   @RequestParam(required = false) String genre,
                                   @RequestParam(required = false) Status status){
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successful", movieService.getList(pageable, keyword, genre, status));
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK.value(), "Get movie successful", movieService.getById(id));
    }

    @PostMapping("/v1")
    public ResponseData<?> addMovie(@RequestBody MovieRequest request){
        movieService.addMovie(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Add movie successful");
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateMovie(@PathVariable Integer id, @RequestBody MovieRequest request){
        movieService.updateMovie(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update movie successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteMovie(@PathVariable Integer id){
        movieService.deleteMovie(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete movie successful");
    }
}
