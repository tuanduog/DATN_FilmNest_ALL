package com.booking.booking_ticket.controller;

import java.util.List;

import com.booking.booking_ticket.dto.request.ShowTimeRequestDTO;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.booking.booking_ticket.dto.ShowTimeDTO;
import com.booking.booking_ticket.service.ShowTimeService;


@RestController
@RequestMapping("/auth")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class ShowTimeController {
    @Autowired
    private ShowTimeService showTimeService;

    @GetMapping("/get-showtime/{id}")
        public ResponseEntity<?> getMovie(@PathVariable int id) {
        List<ShowTimeDTO> showTimes = showTimeService.getByMovieId(id);
        return ResponseEntity.ok(showTimes);
    }
    @GetMapping("/get-showtime")
    public ResponseData<?> getShowtimes() {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"User found!",showTimeService.getShowTime());
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @PostMapping("/add-Showtime")
    public ResponseData<?> addShowtime( @RequestBody ShowTimeRequestDTO showTimeRequestDTO) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Showtimes add!",showTimeService.addShowtime(showTimeRequestDTO));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @PutMapping("/edit-Showtime")
    public ResponseData<?> editShowtime(@RequestParam int id, @RequestBody ShowTimeRequestDTO showTimeRequestDTO) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"SHowtime edit!",showTimeService.editShowtime(id,showTimeRequestDTO));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @DeleteMapping("/delete-Showtime")
    public ResponseData<?> deleteShowtime(@RequestParam int id) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"SHowtime delete!",showTimeService.deleteMovie(id));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @GetMapping("/get-showtime-ByRoomId")
    public ResponseData<?> getShowtimes(@RequestParam int roomId) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"User found!",showTimeService.getShowtimeByRoomId(roomId));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

}
