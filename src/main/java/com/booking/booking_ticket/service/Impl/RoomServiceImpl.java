package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.RoomDTO;
import com.booking.booking_ticket.entity.Rooms;
import com.booking.booking_ticket.repository.RoomRepository;
import com.booking.booking_ticket.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;


    @Override
    public List<Rooms> getRoomByTheaterId(int theaterId) {
        return  roomRepository.getRoomsByTheater(theaterId);
    }
}
