package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.RoomRequest;
import com.booking.booking_ticket.dto.response.RoomResponse;
import com.booking.booking_ticket.entity.Room;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RoomService {

    public List<Room> getRoomByTheaterId(int theaterId);

    public Page<RoomResponse> getList(Pageable pageable, String keyword, Status status);

    public Page<RoomResponse> getListByTheaterId(Integer theaterId, Pageable pageable, String keyword, Status status);

    public void addRoom(RoomRequest request);

    public void updateRoom(Integer id, RoomRequest request);

    public void deleteRoom(Integer id);

    public RoomResponse getById(Integer id);
}
