package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.RoomRequest;
import com.booking.booking_ticket.dto.request.SeatRequest;
import com.booking.booking_ticket.dto.response.RoomResponse;
import com.booking.booking_ticket.entity.Room;
import com.booking.booking_ticket.entity.Seat;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.repository.RoomRepository;
import com.booking.booking_ticket.repository.SeatRepository;
import com.booking.booking_ticket.repository.TheaterRepository;
import com.booking.booking_ticket.service.RoomService;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    private final TheaterRepository theaterRepository;

    private final SeatRepository seatRepository;

    @Override
    public List<Room> getRoomByTheaterId(int theaterId) {
        return  roomRepository.getRoomsByTheater(theaterId);
    }

    @Override
    public Page<RoomResponse> getList(Pageable pageable, String keyword, Status status) {
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return roomRepository.findAllForKeyword(pageable, keyword, status);
    }

    @Override
    @Transactional
    public void addRoom(RoomRequest request){
        Optional<Room> room = roomRepository.findByName(request.getName());
        if (room.isPresent()){
            throw new RuntimeException("This room already exists");
        }

        Room r = new Room();
        r.setName(request.getName());
        r.setType(request.getType());
        r.setCapacity(request.getCapacity());
        r.setTotalColumn(request.getTotalColumn());
        r.setTotalRow(request.getTotalRow());
        r.setStatus(Status.ACTIVE);
        Theater theater = theaterRepository.findById(request.getTheaterId()).orElseThrow(()-> new RuntimeException("Theater does not exist"));
        r.setTheater(theater);
        Room saveRoom = roomRepository.save(r);

        List<Seat> seats = new ArrayList<>();
        List<SeatRequest> seatRequests = Arrays.asList(request.getSeats());
        for (SeatRequest s : seatRequests) {
            Seat seat = new Seat();
            seat.setRoom(saveRoom);
            seat.setCode(s.getLabel());
            seat.setType(s.getType());
            seat.setSeatStatus(s.getSeatStatus());
            seat.setPrice(s.getPrice());
            seat.setRowIndex(s.getRow());
            seat.setColumnIndex(s.getCol());
            seats.add(seat);
        }
        seatRepository.saveAll(seats);
    }

    @Override
    public void updateRoom(Integer id, RoomRequest request){

    }

    @Override
    public RoomResponse getById(Integer id){
        return null;
    }

    @Override
    public void deleteRoom(Integer id){
        Optional<Room> room = roomRepository.findById(id);
        if(room.isPresent()){
            room.get().setStatus(Status.INACTIVE);
            roomRepository.save(room.get());
        }
    }
}
