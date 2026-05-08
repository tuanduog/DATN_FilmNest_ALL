package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.response.SeatResponse;

import java.util.List;

public interface SeatService{

    public List<SeatResponse> getByRoomId(Integer id);
}
