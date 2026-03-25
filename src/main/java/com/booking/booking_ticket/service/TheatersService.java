package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.ThearterRequestDTO;
import com.booking.booking_ticket.entity.Theater;

import java.util.List;

public interface TheatersService {

    List<String> getLocations();

    List<Theater> getTheatersByLocation(String location);

    List<Theater> getAllTheater();

    int addTheater(ThearterRequestDTO movieRequestDTO);

    int editTheater(int id, ThearterRequestDTO movieRequestDTO);

    int deleteTheater(int id);
}