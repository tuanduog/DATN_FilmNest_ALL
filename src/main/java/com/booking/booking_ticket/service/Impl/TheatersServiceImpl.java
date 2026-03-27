package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.ThearterRequestDTO;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.repository.TheaterRepository;
import com.booking.booking_ticket.service.TheatersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheatersServiceImpl implements TheatersService {

    @Autowired
    public TheaterRepository theaterRepository;

    @Override
    public List<String> getLocations() {
        return theaterRepository.getLocations();
    }

    @Override
    public List<Theater> getTheatersByLocation(String location) {
        return theaterRepository.getTheatersByTheaterLocation(location);
    }

    @Override
    public List<Theater> getAllTheater() {
        return theaterRepository.findAll();
    }

    @Override
    public int addTheater(ThearterRequestDTO movieRequestDTO) {

        Theater theaters = Theater.builder()
                .name((movieRequestDTO.getTheaterName()))
                .location(movieRequestDTO.getLocation())
                .build();
        theaterRepository.save(theaters);

        return theaters.getId();
    }

    @Override
    public int editTheater(int id, ThearterRequestDTO movieRequestDTO) {
        Theater theaters = theaterRepository.findById(id).get();
        theaters.setName(movieRequestDTO.getTheaterName());
        theaters.setLocation(movieRequestDTO.getLocation());

        theaterRepository.save(theaters);
        return theaters.getId();
    }

    @Override
    public int deleteTheater(int id) {
        Theater theaters = theaterRepository.findById(id).get();
        theaterRepository.delete(theaters);
        return theaters.getId();
    }
}