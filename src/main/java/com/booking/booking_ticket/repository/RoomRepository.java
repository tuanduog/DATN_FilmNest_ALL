package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.RoomResponse;
import com.booking.booking_ticket.dto.response.TheaterResponse;
import com.booking.booking_ticket.entity.Room;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room,Integer> {

    @Query("select r from Room r where r.theater.id = :theaterId")
    List<Room> getRoomsByTheater(@Param("theaterId") Integer theaterId);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.RoomResponse(r.id, r.name, r.capacity, r.totalRow, r.totalColumn, r.type, r.theater.name, r.status)
        FROM Room r
        WHERE (LOWER(r.name) LIKE :keyword)
        AND (:status IS NULL OR r.status = :status)
    """)
    Page<RoomResponse> findAllForKeyword(Pageable pageable, String keyword, Status status);

    Optional<Room> findByName(String name);
}
