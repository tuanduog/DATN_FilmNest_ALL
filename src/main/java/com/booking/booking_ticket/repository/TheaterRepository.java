package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theater,Integer> {

    @Query("Select distinct t.location from Theater t")
    List<String> getLocations();

    @Query("select t from Theater t where t.location like :location")
    List<Theater> getTheatersByTheaterLocation(@Param("location") String location);
}