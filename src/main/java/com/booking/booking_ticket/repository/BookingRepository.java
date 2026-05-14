package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.*;
import com.booking.booking_ticket.entity.Booking;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.booking.booking_ticket.utils.ChartFilterType;
import com.booking.booking_ticket.utils.PaymentStatus;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.booking.booking_ticket.dto.BookingDTO;
import com.booking.booking_ticket.dto.BookingSimpleDTO;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Integer> {

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE MONTH(b.createdAt) = MONTH(CURRENT_DATE) AND YEAR(b.createdAt) = YEAR(CURRENT_DATE)")
    Double getCurrentMonthRevenue();

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE YEAR (b.createdAt) = YEAR(CURRENT_DATE)")
    Double getCurrentYearRevenue();

    @Query("SELECT COUNT(b) FROM Booking b WHERE YEAR(b.createdAt) = YEAR(CURRENT_DATE)")
    Long countBookingsThisYear();

    @Query("SELECT count (b) FROM Booking b WHERE MONTH(b.createdAt) = MONTH(CURRENT_DATE)")
    Long getCurrentMonthCustomersAmount();

    @Query("SELECT count (b) FROM Booking b WHERE DAY(b.createdAt) = DAY(CURRENT_DATE)")
    Integer getCurrentDayCustomersAmount();

    @Query("SELECT MONTH(b.createdAt) AS month, COUNT(b) AS totalBookings, SUM(b.totalPrice) AS totalRevenue " +
            "FROM Booking b " +
            "WHERE YEAR(b.createdAt) = :year " +
            "GROUP BY MONTH(b.createdAt) " +
            "ORDER BY month(b.createdAt)")
    List<Object[]> findMonthlyBookingStats(@Param("year") int year);

    @Query("SELECT DAY(b.createdAt) AS day, COUNT(b) AS totalBookings, SUM(b.totalPrice) AS totalRevenue " +
            "FROM Booking b " +
            "WHERE YEAR(b.createdAt) = YEAR(CURRENT_DATE)" +
            "AND MONTH(b.createdAt) = :month " +
            "GROUP BY DAY(b.createdAt) " +
            "ORDER BY DAY(b.createdAt)")
    List<Object[]> findYearlyBookingStats(@Param("month") int month);

    @Query("SELECT m.genre AS category, COUNT(b) AS total " +
            "FROM Booking b " +
            "JOIN b.showTime s " +
            "JOIN s.movie m " +
            "GROUP BY m.genre")
    List<BookingByCategoryStats> countBookingsByMovieCategory();

    @Query("SELECT new com.booking.booking_ticket.dto.response.BookingResponse(u.username, b.totalPrice, m.name, b.paymentStatus) " +
            "FROM Booking b " +
            "JOIN b.user u " +
            "JOIN b.showTime s " +
            "JOIN s.movie m")
    List<BookingResponse> getAllBookingResponse();

    @Query("""
        SELECT new com.booking.booking_ticket.dto.BookingDTO(
            b.id,
            b.code,
            b.chair,
            b.totalPrice,
            b.date,
            m.image,
            m.name,
            s.startTime,
            r.name,
            t.name,
            t.address
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
    "b.id, b.chair, b.totalPrice, b.date, b.user.id, b.showTime.id) " +
    "FROM Booking b WHERE b.showTime.id = :showTimeId")
    List<BookingSimpleDTO> findBookingSimpleDTOByShowTimeId(@Param("showTimeId") Integer showTimeId);

    // ============= new report =============

    @Query(value = """
        SELECT
            CASE
                WHEN :#{#filterType.name()} = 'TODAY'
                    THEN TO_CHAR(DATE_TRUNC('hour', b.updated_at), 'HH24:00')
    
                WHEN :#{#filterType.name()} IN ('WEEK', 'MONTH')
                    THEN TO_CHAR(DATE_TRUNC('day', b.updated_at), 'DD/MM')
    
                WHEN :#{#filterType.name()} = 'YEAR'
                    THEN TO_CHAR(DATE_TRUNC('month', b.updated_at), 'MM/YYYY')
            END AS label,
    
            COALESCE(
                SUM(
                    b.total_price - COALESCE(combo.total_combo_price, 0)
                ),
                0
            ) AS revenue,
    
            COALESCE(
                SUM(LENGTH(b.chair) - LENGTH(REPLACE(b.chair, ',', '')) + 1),
                0
            ) AS tickets
    
        FROM booking b
    
        LEFT JOIN (
            SELECT
                bc.booking_id,
                SUM(bc.quantity * bc.price) AS total_combo_price
            FROM booking_combo bc
            GROUP BY bc.booking_id
        ) combo ON combo.booking_id = b.id
    
        JOIN show_time st ON st.id = b.showtime_id
        JOIN room r ON r.id = st.room_id
    
        WHERE b.updated_at BETWEEN :startTime AND :endTime
            AND b.payment_status = 'DONE'
            AND (:theaterId IS NULL OR r.theater_id = :theaterId)
    
        GROUP BY 1
        ORDER BY MIN(b.updated_at)
    """, nativeQuery = true)
    List<TicketReportResponse> getTicketChart(
            @Param("theaterId") Integer theaterId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("filterType") ChartFilterType filterType
    );

    @Query(value = """
        SELECT 'Vé xem phim' AS name,
               COALESCE(SUM(b.total_price - COALESCE(combo.total_combo_price, 0)), 0) AS value,
               COALESCE(SUM(LENGTH(b.chair) - LENGTH(REPLACE(b.chair, ',', '')) + 1), 0) AS count
        FROM booking b
        LEFT JOIN (
            SELECT
                bc.booking_id,
                SUM(bc.quantity * bc.price) AS total_combo_price
            FROM booking_combo bc
            GROUP BY bc.booking_id
        ) combo ON combo.booking_id = b.id
        JOIN show_time st ON st.id = b.showtime_id
        JOIN room r ON r.id = st.room_id
        WHERE b.updated_at BETWEEN :startTime AND :endTime
            AND b.payment_status = 'DONE'
            AND (:theaterId IS NULL OR r.theater_id = :theaterId)
    
        UNION ALL
    
        SELECT 'Combo ưu đãi' AS name,
               COALESCE(SUM(bc.quantity * bc.price), 0) AS value,
               COALESCE(SUM(bc.quantity), 0) AS count
        FROM booking_combo bc
        JOIN booking b ON b.id = bc.booking_id
        JOIN show_time st ON st.id = b.showtime_id
        JOIN room r ON r.id = st.room_id
        WHERE b.updated_at BETWEEN :startTime AND :endTime
            AND b.payment_status = 'DONE'
            AND (:theaterId IS NULL OR r.theater_id = :theaterId)
    
        UNION ALL
    
        SELECT 'Gói hội viên' AS name,
               COALESCE(SUM(um.price), 0) AS value,
               COUNT(um.id) AS count
        FROM user_membership um
        WHERE um.created_at BETWEEN :startTime AND :endTime
            AND um.membership_payment_status = 'ACTIVE'
    """, nativeQuery = true)
    List<StructureRevenueResponse> getRevenueStructureChart(
            @Param("theaterId") Integer theaterId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query(value = """
        SELECT
            m.name AS name,
            COALESCE(SUM(b.total_price - COALESCE(combo.total_combo_price, 0)), 0) AS revenue,
            COALESCE(SUM(LENGTH(b.chair) - LENGTH(REPLACE(b.chair, ',', '')) + 1), 0) AS tickets
        FROM booking b
        LEFT JOIN (
            SELECT bc.booking_id,
                   SUM(bc.quantity * bc.price) AS total_combo_price
            FROM booking_combo bc
            GROUP BY bc.booking_id
        ) combo ON combo.booking_id = b.id
        JOIN show_time st ON st.id = b.showtime_id
        JOIN room r ON r.id = st.room_id
        JOIN movie m ON m.id = st.movie_id
        WHERE b.updated_at BETWEEN :startTime AND :endTime
          AND b.payment_status = 'DONE'
          AND (:theaterId IS NULL OR r.theater_id = :theaterId)
        GROUP BY m.id, m.name
        ORDER BY revenue DESC
    """, nativeQuery = true)
    List<MovieReportResponse> getMovieChart(
            @Param("theaterId") Integer theaterId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query(value = """
        SELECT
            t.name AS date,
            COALESCE(SUM(b_agg.revenue), 0)  AS revenue,
            CASE
                WHEN COALESCE(SUM(r.capacity), 0) = 0 THEN 0
                ELSE ROUND(
                    CAST(SUM(b_agg.tickets) AS NUMERIC) /
                    CAST(COALESCE(SUM(r.capacity), 1) AS NUMERIC) * 100,
                    2
                )
            END AS occupancy
        FROM theater t
        JOIN room r ON r.theater_id = t.id
        JOIN show_time st ON st.room_id = r.id
        JOIN (
            SELECT
                b.showtime_id,
                SUM(b.total_price - COALESCE(combo.total_combo_price, 0)) AS revenue,
                SUM(LENGTH(b.chair) - LENGTH(REPLACE(b.chair, ',', '')) + 1) AS tickets
            FROM booking b
            LEFT JOIN (
                SELECT bc.booking_id, SUM(bc.quantity * bc.price) AS total_combo_price
                FROM booking_combo bc
                GROUP BY bc.booking_id
            ) combo ON combo.booking_id = b.id
            WHERE b.updated_at BETWEEN :startTime AND :endTime
              AND b.payment_status = 'DONE'
            GROUP BY b.showtime_id
        ) b_agg ON b_agg.showtime_id = st.id
        GROUP BY t.id, t.name
        ORDER BY revenue DESC
    """, nativeQuery = true)
    List<OccupancyReportResponse> getTheaterChart(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query(value = """
        SELECT
            r.name AS date,
            COALESCE(SUM(b_agg.revenue), 0) AS revenue,
            CASE
                WHEN COALESCE(SUM(r.capacity), 0) = 0 THEN 0
                ELSE ROUND(
                    CAST(SUM(b_agg.tickets) AS NUMERIC) /
                    CAST(COALESCE(SUM(r.capacity), 1) AS NUMERIC) * 100,
                    2
                )
            END AS occupancy
        FROM room r
        JOIN show_time st ON st.room_id = r.id
        JOIN (
            SELECT
                b.showtime_id,
                SUM(b.total_price - COALESCE(combo.total_combo_price, 0)) AS revenue,
                SUM(LENGTH(b.chair) - LENGTH(REPLACE(b.chair, ',', '')) + 1) AS tickets
            FROM booking b
            LEFT JOIN (
                SELECT bc.booking_id, SUM(bc.quantity * bc.price) AS total_combo_price
                FROM booking_combo bc
                GROUP BY bc.booking_id
            ) combo ON combo.booking_id = b.id
            WHERE b.updated_at BETWEEN :startTime AND :endTime
              AND b.payment_status = 'DONE'
            GROUP BY b.showtime_id
        ) b_agg ON b_agg.showtime_id = st.id
        WHERE (:theaterId IS NULL OR r.theater_id = :theaterId)
        GROUP BY r.id, r.name, r.capacity
        ORDER BY revenue DESC
    """, nativeQuery = true)
    List<OccupancyReportResponse> getRoomChart(
            @Param("theaterId") Integer theaterId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query(value = """
        SELECT
            (
                COALESCE((
                    SELECT SUM(b.total_price)
                    FROM booking b
                    WHERE b.updated_at BETWEEN :startTime AND :endTime AND b.payment_status = 'DONE'
                ), 0) +
                COALESCE((
                    SELECT SUM(um.price)
                    FROM user_membership um
                    WHERE um.created_at BETWEEN :startTime AND :endTime AND um.membership_payment_status = 'ACTIVE'
                ), 0)
            ) AS totalRevenue,
            COALESCE((
                SELECT SUM(LENGTH(b.chair) - LENGTH(REPLACE(b.chair, ',', '')) + 1)
                FROM booking b
                WHERE b.updated_at BETWEEN :startTime AND :endTime AND b.payment_status = 'DONE'
            ), 0) AS tickets,
            COALESCE((
                SELECT SUM(bc.quantity)
                FROM booking_combo bc
                JOIN booking b ON b.id = bc.booking_id
                WHERE b.updated_at BETWEEN :startTime AND :endTime AND b.payment_status = 'DONE'
            ), 0) AS combos,
            COALESCE((
                SELECT ROUND(
                    CAST(SUM(LENGTH(b.chair) - LENGTH(REPLACE(b.chair, ',', '')) + 1) AS NUMERIC) /
                    CAST(NULLIF(SUM(r.capacity), 0) AS NUMERIC) * 100,
                    2
                )
                FROM booking b
                JOIN show_time st ON st.id = b.showtime_id
                JOIN room r ON r.id = st.room_id
                WHERE b.updated_at BETWEEN :startTime AND :endTime AND b.payment_status = 'DONE'
            ), 0) AS avgOccupancy
    """, nativeQuery = true)
    LastSummaryResponse getAdminLastSummary(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query(value = """
        SELECT
            COALESCE((
                SELECT SUM(b.total_price)
                FROM booking b
                JOIN show_time st ON st.id = b.showtime_id
                JOIN room r ON r.id = st.room_id
                WHERE b.updated_at BETWEEN :startTime AND :endTime 
                  AND b.payment_status = 'DONE' 
                  AND r.theater_id = :theaterId
            ), 0) AS totalRevenue,
            COALESCE((
                SELECT SUM(LENGTH(b.chair) - LENGTH(REPLACE(b.chair, ',', '')) + 1)
                FROM booking b
                JOIN show_time st ON st.id = b.showtime_id
                JOIN room r ON r.id = st.room_id
                WHERE b.updated_at BETWEEN :startTime AND :endTime 
                  AND b.payment_status = 'DONE' 
                  AND r.theater_id = :theaterId
            ), 0) AS tickets,
            COALESCE((
                SELECT SUM(bc.quantity)
                FROM booking_combo bc
                JOIN booking b ON b.id = bc.booking_id
                JOIN show_time st ON st.id = b.showtime_id
                JOIN room r ON r.id = st.room_id
                WHERE b.updated_at BETWEEN :startTime AND :endTime 
                  AND b.payment_status = 'DONE' 
                  AND r.theater_id = :theaterId
            ), 0) AS combos,
            COALESCE((
                SELECT ROUND(
                    CAST(SUM(LENGTH(b.chair) - LENGTH(REPLACE(b.chair, ',', '')) + 1) AS NUMERIC) /
                    CAST(NULLIF(SUM(r.capacity), 0) AS NUMERIC) * 100,
                    2
                )
                FROM booking b
                JOIN show_time st ON st.id = b.showtime_id
                JOIN room r ON r.id = st.room_id
                WHERE b.updated_at BETWEEN :startTime AND :endTime 
                  AND b.payment_status = 'DONE' 
                  AND r.theater_id = :theaterId
            ), 0) AS avgOccupancy
    """, nativeQuery = true)
    LastSummaryResponse getManagerLastSummary(
            @Param("theaterId") Integer theaterId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.OrderResponse(
            b.id, b.user.username, b.code, b.chair, b.totalPrice, b.paymentStatus
        )
        FROM Booking b
        WHERE (LOWER(b.code) LIKE :keyword)
        AND (:paymentStatus IS NULL OR b.paymentStatus = :paymentStatus)
        AND (:startDate IS NULL OR b.date >= :startDate)
        AND (:endDate IS NULL OR b.date <= :endDate)
    """)
    Page<OrderResponse> findAllByKeyword(Pageable pageable,
                                         @Param("keyword") String keyword,
                                         @Param("paymentStatus") PaymentStatus paymentStatus,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.OrderResponse(
            b.id, b.user.username, b.code, b.chair, b.totalPrice, b.paymentStatus)
        FROM Booking b
        WHERE b.id = :id
    """)
    OrderResponse findOrderByBookingId(Integer id);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.OrderResponse(
            b.id, b.user.username, b.code, b.chair, b.totalPrice, b.paymentStatus
        )
        FROM Booking b
        WHERE (LOWER(b.code) LIKE :keyword)
            AND (:paymentStatus IS NULL OR b.paymentStatus = :paymentStatus)
            AND (:startDate IS NULL OR b.date >= :startDate)
            AND (:endDate IS NULL OR b.date <= :endDate)
            AND b.showTime.room.theater.id = :id
    """)
    Page<OrderResponse> findAllByKeywordAndTheaterId( Integer id,
                                         Pageable pageable,
                                         @Param("keyword") String keyword,
                                         @Param("paymentStatus") PaymentStatus paymentStatus,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);
}

