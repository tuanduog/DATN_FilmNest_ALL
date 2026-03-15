package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;
import com.booking.booking_ticket.entity.Movies;
import com.booking.booking_ticket.entity.Rooms;
import com.booking.booking_ticket.service.Impl.RoomServiceImpl;
import com.booking.booking_ticket.service.Impl.TheatersServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/room")
public class RoomController {

    private final RoomServiceImpl roomService;

    @GetMapping("/getRoomsByTheaterId")
    public ResponseData<?> getRoomByTheaterId(@RequestParam int theaterId)
    {
        try{
            List<Rooms> result = roomService.getRoomByTheaterId(theaterId);
            System.out.println(result.size());
            if(!result.isEmpty())
                return new ResponseData<>(HttpStatus.OK.value(),"Có phonòng",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "room null");
        }
        catch (Exception e)
        {
            log.error("there is an error of introspect: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }


    }

}
