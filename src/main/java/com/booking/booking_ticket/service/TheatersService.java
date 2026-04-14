package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.TheaterRequest;
import com.booking.booking_ticket.dto.response.TheaterResponse;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TheatersService {

    List<String> getLocations();

    List<Theater> getTheatersByLocation(String location);

    List<Theater> getAllTheater();

    Page<TheaterResponse> getList(Pageable pageable, String keyword, Status status);

    void addTheater(TheaterRequest request);

    void editTheater(int id, TheaterRequest request);

    void deleteTheater(int id);
}