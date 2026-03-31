package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.ShowtimeResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.booking.booking_ticket.entity.ShowTime;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime, Integer>{
    @EntityGraph(attributePaths = {"room"})
    List<ShowTime> findByMovie_Id(Integer movieId);

    @Query("SELECT new com.booking.booking_ticket.dto.response.ShowtimeResponse(s.id, s.startTime, m.name, m.id, t.name,t.id,r.name,r.id) " +
            "FROM ShowTime s " +
            "JOIN s.room r " +
            "JOIN r.theater t " +
            "JOIN s.movie m")
    List<ShowtimeResponse> findAllShowtimes();

    @Query("SELECT s f from ShowTime  s where s.room.id = :roomId")
    List<ShowTime> findShowtimeByRoomId(Integer roomId);

    @Query("SELECT new com.booking.booking_ticket.dto.response.ShowtimeResponse(s.id, s.startTime, m.name, m.id, t.name,t.id,r.name,r.id) " +
            "FROM ShowTime s " +
            "JOIN s.room r " +
            "JOIN r.theater t " +
            "JOIN s.movie m where m.showingStatus = :showingStatus and s.room.id = :roomId")
    List<ShowtimeResponse> findShow_timeByRooms(Integer roomId, String showingStatus);
}
