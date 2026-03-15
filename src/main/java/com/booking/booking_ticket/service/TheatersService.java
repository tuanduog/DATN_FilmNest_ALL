package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.MovieRequestDTO;
import com.booking.booking_ticket.dto.request.ThearterRequestDTO;
import com.booking.booking_ticket.entity.Theaters;

import java.util.List;

public interface TheatersService {
    List<String> getLocations();

    List<Theaters> getTheatersByLocation(String location);

    List<Theaters> getAllTheater();


     int addTheater(ThearterRequestDTO movieRequestDTO);

     int editTheater(int id, ThearterRequestDTO movieRequestDTO);

     int deleteTheater(int id);


}