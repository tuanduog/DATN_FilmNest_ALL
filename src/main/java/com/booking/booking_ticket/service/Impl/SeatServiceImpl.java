package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.response.SeatResponse;
import com.booking.booking_ticket.entity.Seat;
import com.booking.booking_ticket.repository.SeatRepository;
import com.booking.booking_ticket.service.SeatService;
import com.booking.booking_ticket.utils.SeatStatus;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;

    @Override
    public List<SeatResponse> getByRoomId(Integer id) {
        return seatRepository.findByRoomId(id, SeatStatus.DELETED);
    }
}
