package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.RoomDTO;
import com.booking.booking_ticket.entity.Rooms;

import java.util.List;

public interface RoomService {

    public List<Rooms> getRoomByTheaterId(int theaterId);
}
