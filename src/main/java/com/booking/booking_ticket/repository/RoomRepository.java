package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.Rooms;
import com.booking.booking_ticket.entity.Theaters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Rooms,Integer> {
    @Query("select r from Rooms r where r.theater.theaterId = :theaterId")
    List<Rooms> getRoomsByTheater(@Param("theaterId") Integer theaterId);


}
