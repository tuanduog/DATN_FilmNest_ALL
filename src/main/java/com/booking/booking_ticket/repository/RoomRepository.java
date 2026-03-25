package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room,Integer> {

    @Query("select r from Room r where r.theater.id = :theaterId")
    List<Room> getRoomsByTheater(@Param("theaterId") Integer theaterId);
}
