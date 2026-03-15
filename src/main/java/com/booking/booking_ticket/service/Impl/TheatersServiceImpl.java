package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.MovieRequestDTO;
import com.booking.booking_ticket.dto.request.ThearterRequestDTO;
import com.booking.booking_ticket.entity.Theaters;
import com.booking.booking_ticket.repository.TheaterRepository;
import com.booking.booking_ticket.service.TheatersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TheatersServiceImpl implements TheatersService {

    public final TheaterRepository theaterRepository;

    @Override
    public List<String> getLocations() {
        return theaterRepository.getLocations();
    }

    @Override
    public List<Theaters> getTheatersByLocation(String location) {
        return theaterRepository.getTheatersByTheaterLocation(location);
    }

    @Override
    public List<Theaters> getAllTheater() {
        return theaterRepository.findAll();
    }

    @Override
    public int addTheater(ThearterRequestDTO movieRequestDTO) {

        Theaters theaters = Theaters.builder()
                .theaterName(movieRequestDTO.getTheaterName())
                .theaterLocation(movieRequestDTO.getLocation())
                .build();
        theaterRepository.save(theaters);

        return theaters.getTheaterId();
    }

    @Override
    public int editTheater(int id, ThearterRequestDTO movieRequestDTO) {
        Theaters theaters = theaterRepository.findById(id).get();
        theaters.setTheaterName(movieRequestDTO.getTheaterName());
        theaters.setTheaterLocation(movieRequestDTO.getLocation());

        theaterRepository.save(theaters);
        return theaters.getTheaterId();
    }

    @Override
    public int deleteTheater(int id) {
        Theaters theaters = theaterRepository.findById(id).get();
        theaterRepository.delete(theaters);
        return theaters.getTheaterId();
    }


}