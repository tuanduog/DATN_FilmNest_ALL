package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.TheaterResponse;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theater,Integer> {

    @Query("Select distinct t.address from Theater t")
    List<String> getLocations();

    @Query("select t from Theater t where t.address like :location")
    List<Theater> getTheatersByTheaterLocation(@Param("location") String location);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.TheaterResponse(t.id, t.name, t.hotline, t.openTime, t.closeTime, t.status)
        FROM Theater t
        WHERE (LOWER(t.name) LIKE :keyword)
        AND (:status IS NULL OR t.status = :status)
    """)
    Page<TheaterResponse> findAllByKeyword(Pageable pageable, String keyword, Status status);
}