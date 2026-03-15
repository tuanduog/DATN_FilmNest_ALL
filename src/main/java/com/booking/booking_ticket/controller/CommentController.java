package com.booking.booking_ticket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.booking.booking_ticket.dto.CommentDTO;
import com.booking.booking_ticket.entity.Comments;
import com.booking.booking_ticket.service.CommentService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class CommentController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private CommentService commentService;

    @MessageMapping("/push-cmt")
    public void sendCmt(@Payload CommentDTO cmt) {
        System.out.println("Received WS comment: " + cmt.getContent());
        Comments saved = commentService.saveCmt(cmt);

        CommentDTO dto = new CommentDTO(
                saved.getCommentId(),
                saved.getParentId(),
                saved.getContent(),
                saved.getLevel(),
                saved.getCreatedAt(),
                saved.getMovie().getMovieId(),
                saved.getUser().getUserId(),
                saved.getUser().getUsername());

        simpMessagingTemplate.convertAndSend("/topic/comment/" + saved.getMovie().getMovieId(), dto);
    };
}
