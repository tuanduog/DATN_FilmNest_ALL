package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.SeatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/seat")
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/v1/room/{id}")
    public ResponseData<?> getByRoomId(@PathVariable Integer id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successful", seatService.getByRoomId(id));
    }
}
