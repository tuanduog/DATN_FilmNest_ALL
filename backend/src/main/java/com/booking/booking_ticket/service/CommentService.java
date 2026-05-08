package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.CommentDTO;
import com.booking.booking_ticket.entity.Comment;

import java.util.List;

public interface CommentService {

    public Comment saveCmt(CommentDTO cmt);

    public List<CommentDTO> getAllComment(Integer movieId);
}
