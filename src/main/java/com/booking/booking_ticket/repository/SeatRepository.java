package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat,Integer> {

    List<Seat> findByRoom_Id(Integer id);

    void deleteAllByRoom_Id(Integer id);
}
