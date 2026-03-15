package com.booking.booking_ticket.controller;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.booking.booking_ticket.dto.SeatSelectingDTO;

@Controller
public class SeatSelectingController {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/seat-selecting")
    public SeatSelectingDTO handleSeatSelecting(SeatSelectingDTO seatSelectingDTO) {
        String redisKey = "seatLock:" + seatSelectingDTO.getMovieId() + ":" + seatSelectingDTO.getShowTimeId() + ":" + seatSelectingDTO.getDate();
        redisTemplate.opsForHash().put(redisKey, seatSelectingDTO.getUserId().toString(), seatSelectingDTO.getSeats());
        redisTemplate.expire(redisKey, 10, TimeUnit.MINUTES);

        Map<Object, Object> lockedSeats = redisTemplate.opsForHash().entries(redisKey);
        simpMessagingTemplate.convertAndSend("/topic/seats/" + seatSelectingDTO.getMovieId() + "/" + seatSelectingDTO.getShowTimeId()
                + "/" + seatSelectingDTO.getDate(), lockedSeats);
        return seatSelectingDTO;
    }

}
