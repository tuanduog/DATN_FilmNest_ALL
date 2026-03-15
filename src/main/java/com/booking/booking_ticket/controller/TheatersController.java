package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.ShowTimeRequestDTO;
import com.booking.booking_ticket.dto.request.ThearterRequestDTO;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;
import com.booking.booking_ticket.entity.Theaters;
import com.booking.booking_ticket.service.Impl.TheatersServiceImpl;
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
@RequestMapping("/theaters")
public class TheatersController {

    private final TheatersServiceImpl theatersService;

    @GetMapping("/getLocations")
    public ResponseData<?> getGenres()
    {
        try{
            List<String> result = theatersService.getLocations();
            System.out.println(result.size());
            if(!result.isEmpty())
                return new ResponseData<>(HttpStatus.OK.value(),"Có location",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "location null");
        }
        catch (Exception e)
        {
            log.error("there is an error of introspect: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }


    }
    @GetMapping("/getTheaterByLocation")
    public ResponseData<?> getGenres(@RequestParam String Location)
    {
        try{
            List<Theaters> result = theatersService.getTheatersByLocation(Location);
            System.out.println(result.size());
            if(!result.isEmpty())
                return new ResponseData<>(HttpStatus.OK.value(),"Có theater",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "theater null");
        }
        catch (Exception e)
        {
            log.error("there is an error of introspect: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }


    }
    @GetMapping("/getTheaters")
    public ResponseData<?> getTheaters()
    {
        try{
            List<Theaters> result = theatersService.getAllTheater();
            if(!result.isEmpty())
                return new ResponseData<>(HttpStatus.OK.value(),"Có theater",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "theater null");
        }
        catch (Exception e)
        {
            log.error("there is an error of introspect: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }


    }

    @PostMapping("/add-Theater")
    public ResponseData<?> addShowtime( @RequestBody ThearterRequestDTO showTimeRequestDTO) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Theater add!",theatersService.addTheater(showTimeRequestDTO));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @PutMapping("/edit-Theater")
    public ResponseData<?> editShowtime(@RequestParam int id, @RequestBody ThearterRequestDTO showTimeRequestDTO) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Theater edit!",theatersService.editTheater(id,showTimeRequestDTO));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @DeleteMapping("/delete-Theater")
    public ResponseData<?> deleteShowtime(@RequestParam int id) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Theater delete!",theatersService.deleteTheater(id));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

}