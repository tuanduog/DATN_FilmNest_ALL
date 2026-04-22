package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.repository.SeatRepository;
import com.booking.booking_ticket.service.SeatService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
}
