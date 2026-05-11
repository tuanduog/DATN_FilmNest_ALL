package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.ReactionDTO;
import com.booking.booking_ticket.dto.response.ReactionResponse;

public interface ReactionService {

    ReactionResponse processReaction(ReactionDTO dto);
}
