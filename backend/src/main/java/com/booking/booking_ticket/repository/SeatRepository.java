package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.SeatResponse;
import com.booking.booking_ticket.entity.Seat;
import com.booking.booking_ticket.utils.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat,Integer> {

    List<Seat> findByRoom_Id(Integer id);

    void deleteAllByRoom_Id(Integer id);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.SeatResponse(s.id, s.code, s.rowIndex, s.columnIndex, s.price, s.type, s.seatStatus)
        FROM Seat s
        WHERE s.room.id = :id
            AND s.seatStatus <> :status
    """)
    List<SeatResponse> findByRoomId(Integer id, SeatStatus status);
}
