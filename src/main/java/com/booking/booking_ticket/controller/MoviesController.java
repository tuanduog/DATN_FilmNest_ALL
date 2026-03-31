package com.booking.booking_ticket.controller;


import com.booking.booking_ticket.dto.request.MovieRequest;
import com.booking.booking_ticket.dto.response.MoviesWithRevenuesResponse;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.service.Impl.MovieServiceImpl;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/movies")
public class MoviesController {

    private final MovieServiceImpl moviesService;

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
            log.error("there is an error of introspect: {}",e.getMessage());
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
            log.error("there is an error of introspect: {}",e.getMessage());
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
            log.error("there is an error of movies controller: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @GetMapping("/get-products-multiple-searching-col")
    public ResponseData<?> getProductMultipleSearchCol( @RequestParam(defaultValue = "0") int pageNo,
                                                        @Min(10)@RequestParam(defaultValue = "10") int pageSize,
                                                        @RequestParam(required = false) String sortBy,
                                                        @RequestParam(required = false) String... search) {
        try {
            return new ResponseData<>(HttpStatus.OK.value(),"User found!",moviesService.getProductsWithMultipleSearchingColumns(pageNo,pageSize,sortBy,search));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
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
            log.error("there is an error : {}",e.getMessage());
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
            log.error("there is an error : {}",e.getMessage());
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
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
}
