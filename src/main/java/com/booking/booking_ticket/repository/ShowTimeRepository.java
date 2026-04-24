package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.ShowTimeResponse;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.booking.booking_ticket.entity.ShowTime;
import org.springframework.data.jpa.repository.EntityGraph;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime, Integer>{
    @EntityGraph(attributePaths = {"room"})
    List<ShowTime> findByMovie_Id(Integer movieId);

    @Query("SELECT new com.booking.booking_ticket.dto.response.ShowTimeResponse(s.id, s.showDate, s.startTime) " +
            "FROM ShowTime s " +
            "JOIN s.room r " +
            "JOIN r.theater t " +
            "JOIN s.movie m")
    List<ShowTimeResponse> findAllShowtimes();

    @Query("SELECT s f from ShowTime  s where s.room.id = :roomId")
    List<ShowTime> findShowtimeByRoomId(Integer roomId);

    @Query("SELECT new com.booking.booking_ticket.dto.response.ShowTimeResponse(s.id, s.showDate, s.startTime) " +
            "FROM ShowTime s " +
            "JOIN s.room r " +
            "JOIN r.theater t " +
            "JOIN s.movie m where m.showingStatus = :showingStatus and s.room.id = :roomId")
    List<ShowTimeResponse> findShow_timeByRooms(Integer roomId, String showingStatus);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.ShowTimeResponse(s.id, s.showDate, s.startTime, m.name, t.name, r.name, s.status)
        FROM ShowTime s
            JOIN Movie m ON m.id = s.movie.id
            JOIN Room r ON r.id = s.room.id
            JOIN Theater t ON t.id = r.theater.id
        WHERE (LOWER(t.name) LIKE :keyword OR LOWER(m.name) LIKE :keyword)
        AND (:status IS NULL OR t.status = :status)
    """)
    Page<ShowTimeResponse> findAllByKeyword(Pageable pageable, String keyword, Status status);

    @Query("""
        SELECT s
        FROM ShowTime s
        WHERE s.showDate = :showDate AND s.startTime = :startTime AND s.movie.id = :movieId AND s.room.id = :roomId
            AND (:id IS NULL OR s.id <> :id)
    """)
    Optional<ShowTime> validateShowTime(LocalDate showDate, LocalTime startTime, int movieId, int roomId, Integer id);
}
