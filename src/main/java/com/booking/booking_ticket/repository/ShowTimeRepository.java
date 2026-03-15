package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.ShowtimeResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.booking.booking_ticket.entity.Show_time;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;


@Repository
public interface ShowTimeRepository extends JpaRepository<Show_time, Integer>{
    @EntityGraph(attributePaths = {"room"})
    List<Show_time> findByMovie_MovieId(Integer movieId);


    @Query("SELECT new com.booking.booking_ticket.dto.response.ShowtimeResponse(s.showTimeId, s.startTime, m.movieName, m.movieId, t.theaterName,t.theaterId,r.roomName,r.roomId) " +
            "FROM Show_time s " +
            "JOIN s.room r " +
            "JOIN r.theater t " +
            "JOIN s.movie m")
    List<ShowtimeResponse> findAllShowtimes();

    @Query("SELECT s f from Show_time  s where s.room.roomId = :roomId")
    List<Show_time> findShowtimesByRoomId(Integer roomId);


    @Query("SELECT new com.booking.booking_ticket.dto.response.ShowtimeResponse(s.showTimeId, s.startTime, m.movieName, m.movieId, t.theaterName,t.theaterId,r.roomName,r.roomId) " +
            "FROM Show_time s " +
            "JOIN s.room r " +
            "JOIN r.theater t " +
            "JOIN s.movie m where m.showing like 'Đang chiếu' and s.room.roomId = :roomId")
    List<ShowtimeResponse> findShow_timeByRooms(Integer roomId);

}
