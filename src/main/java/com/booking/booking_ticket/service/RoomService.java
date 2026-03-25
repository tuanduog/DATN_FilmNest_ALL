package com.booking.booking_ticket.service;

import com.booking.booking_ticket.entity.Room;

import java.util.List;

public interface RoomService {

    public List<Room> getRoomByTheaterId(int theaterId);
}
