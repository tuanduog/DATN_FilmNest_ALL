package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.BookingByCategoryStats;
import com.booking.booking_ticket.dto.response.BookingResponse;
import com.booking.booking_ticket.entity.Booking;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.booking.booking_ticket.dto.BookingDTO;
import com.booking.booking_ticket.dto.BookingSimpleDTO;
import com.booking.booking_ticket.entity.Booking;


import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Integer> {

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE MONTH(b.created_at) = MONTH(CURRENT_DATE) AND YEAR(b.created_at) = YEAR(CURRENT_DATE)")
    Double getCurrentMonthRevenue();

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE YEAR (b.created_at) = YEAR(CURRENT_DATE)")
    Double getCurrentYearRevenue();

    @Query("SELECT COUNT(b) FROM Booking b WHERE YEAR(b.created_at) = YEAR(CURRENT_DATE)")
    Long countBookingsThisYear();

    @Query("SELECT count (b) FROM Booking b WHERE MONTH(b.created_at) = MONTH(CURRENT_DATE)")
    Long getCurrentMonthCustomersAmount();

    @Query("SELECT count (b) FROM Booking b WHERE DAY(b.created_at) = DAY(CURRENT_DATE)")
    Integer getCurrentDayCustomersAmount();

    @Query("SELECT MONTH(b.created_at) AS month, COUNT(b) AS totalBookings, SUM(b.totalPrice) AS totalRevenue " +
            "FROM Booking b " +
            "WHERE YEAR(b.created_at) = :year " +
            "GROUP BY MONTH(b.created_at) " +
            "ORDER BY month(b.created_at)")
    List<Object[]> findMonthlyBookingStats(@Param("year") int year);

    @Query("SELECT DAY(b.created_at) AS day, COUNT(b) AS totalBookings, SUM(b.totalPrice) AS totalRevenue " +
            "FROM Booking b " +
            "WHERE YEAR(b.created_at) = YEAR(CURRENT_DATE)" +
            "AND MONTH(b.created_at) = :month " +
            "GROUP BY DAY(b.created_at) " +
            "ORDER BY DAY(b.created_at)")
    List<Object[]> findYearlyBookingStats(@Param("month") int month);

    @Query("SELECT m.genre AS category, COUNT(b) AS total " +
            "FROM Booking b " +
            "JOIN b.showTime s " +
            "JOIN s.movie m " +
            "GROUP BY m.genre")
    List<BookingByCategoryStats> countBookingsByMovieCategory();


    @Query("SELECT new com.booking.booking_ticket.dto.response.BookingResponse(u.username, b.totalPrice, m.movieName, b.ticketStatus) " +
            "FROM Booking b " +
            "JOIN b.user u " +
            "JOIN b.showTime s " +
            "JOIN s.movie m")
    List<BookingResponse> getAllBookingResponse();



    @Query("""
            SELECT new com.booking.booking_ticket.dto.BookingDTO(
                b.id,
                b.chair,
                b.totalPrice,
                b.combo,
                b.date,
                m.image,
                m.movieName,
                s.startTime,
                r.roomName,
                t.theaterName,
                t.theaterLocation
            )
                FROM Booking b
                JOIN b.showTime s
                JOIN s.movie m
                JOIN s.room r
                JOIN r.theater t
                WHERE b.user.id = :userId
            """)
            List<BookingDTO> findBookingByUserId(@Param("userId") Integer userId);

            List<Booking> findByShowTime_Id(Integer showTimeId);

            @Query("SELECT new com.booking.booking_ticket.dto.BookingSimpleDTO(" +
            "b.id, b.chair, b.totalPrice, b.combo, b.date, b.user.id, b.showTime.id) " +
            "FROM Booking b WHERE b.showTime.id = :showTimeId")
            List<BookingSimpleDTO> findBookingSimpleDTOByShowTimeId(@Param("showTimeId") Integer showTimeId);


}

