package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat,Integer> {
}
