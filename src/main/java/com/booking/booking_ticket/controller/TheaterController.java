package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.TheaterRequest;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.service.Impl.TheaterServiceImpl;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("api/theater")
public class TheaterController {

    private final TheaterServiceImpl theatersService;

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
        try {
            List<Theater> result = theatersService.getTheatersByLocation(Location);
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
        try {
            List<Theater> result = theatersService.getAllTheater();
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

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable, @RequestParam(required = false) String keyword, @RequestParam(required = false) Status status){
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successful", theatersService.getList(pageable, keyword, status));
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK.value(), "Get theater successful", theatersService.getById(id));
    }

    @PostMapping("/v1")
    public ResponseData<?> addTheater(@RequestBody TheaterRequest request){
        theatersService.addTheater(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Add theater successful");
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateTheater(@PathVariable Integer id, @RequestBody TheaterRequest request){
        theatersService.updateTheater(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update theater successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteTheater(@PathVariable Integer id){
        theatersService.deleteTheater(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete theater successful");
    }
}