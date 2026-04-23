package com.booking.booking_ticket.controller;

import java.util.List;

import com.booking.booking_ticket.dto.request.RoomRequest;
import com.booking.booking_ticket.dto.request.ShowTimeRequest;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;
import com.booking.booking_ticket.service.ShowTimeService;
import com.booking.booking_ticket.utils.Status;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.booking.booking_ticket.dto.ShowTimeDTO;

@RestController
@RequestMapping("/api/showtime")
@Slf4j
public class ShowTimeController {
    @Autowired
    private ShowTimeService showTimeService;

    @GetMapping("/get-showtime/{id}")
        public ResponseEntity<?> getMovie(@PathVariable int id) {
        List<ShowTimeDTO> showTimes = showTimeService.getByMovieId(id);
        return ResponseEntity.ok(showTimes);
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

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable, @RequestParam(required = false) String keyword, @RequestParam(required = false) Status status){
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successful", showTimeService.getList(pageable, keyword, status));
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK.value(), "Get showtime successful", showTimeService.getById(id));
    }

    @PostMapping("/v1")
    public ResponseData<?> addShowTime(@RequestBody ShowTimeRequest request){
        showTimeService.addShowTime(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Add showtime successful");
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateShowTime(@PathVariable Integer id, @RequestBody ShowTimeRequest request){
        showTimeService.updateShowTime(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update showtime successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteRoom(@PathVariable Integer id){
        showTimeService.deleteShowTime(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete showtime successful");
    }
}
