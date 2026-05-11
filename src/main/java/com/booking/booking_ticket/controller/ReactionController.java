package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.ReactionDTO;
import com.booking.booking_ticket.dto.response.ReactionResponse;
import com.booking.booking_ticket.service.ReactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class ReactionController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ReactionService reactionService;

    @MessageMapping("/push-reaction")
    public void sendReaction(@Payload ReactionDTO reaction) {
        ReactionResponse response = reactionService.processReaction(reaction);
        simpMessagingTemplate.convertAndSend("/topic/reaction/" + response.getMovieId(), response);
    }
}
