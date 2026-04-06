package com.booking.booking_ticket.controller;

import java.util.List;

import com.booking.booking_ticket.dto.request.MovieRequest;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;
import com.booking.booking_ticket.service.Impl.MovieServiceImpl;
import com.booking.booking_ticket.service.MovieService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.booking.booking_ticket.entity.Movie;

@RestController
@RequestMapping("/movie")
@CrossOrigin(origins = "http://localhost:5173")
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
    @GetMapping("/get")
    public ResponseData<?> getProductMultipleSearchCol( @RequestParam(required = false) Pageable pageable,
                                                        @RequestParam(required = false) String keyword,
                                                        @RequestParam(required = false) String genre,
                                                        @RequestParam(required = false) Integer status) {
        try {
            return new ResponseData<>(HttpStatus.OK.value(),"User found!", movieService.getList(pageable, keyword, genre, status));
        }
        catch (Exception e)
        {
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @PostMapping("/add-Movies")
    public ResponseData<?> addMovies( @RequestBody MovieRequest movies) {
        try {
            return new ResponseData<>(HttpStatus.OK.value(),"Movies add!",moviesService.addMovie(movies));
        }
        catch (Exception e)
        {
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @PostMapping("/edit-Movies")
    public ResponseData<?> editMovies(@RequestParam int id, @RequestBody MovieRequest movies) {
        try {
            return new ResponseData<>(HttpStatus.OK.value(),"Movies edit!",moviesService.editMovie(id,movies));
        }
        catch (Exception e)
        {
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @DeleteMapping("/delete-Movies")
    public ResponseData<?> deleteMovies(@RequestParam int id) {
        try {
            return new ResponseData<>(HttpStatus.NO_CONTENT.value(),"Movies delete!",moviesService.deleteMovie(id));
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
}
