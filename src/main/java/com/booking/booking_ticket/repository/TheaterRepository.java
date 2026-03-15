package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.Theaters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theaters,Integer> {

    @Query("Select distinct t.theaterLocation from Theaters t")
    List<String> getLocations();

    @Query("select t from Theaters t where t.theaterLocation like :location")
    List<Theaters> getTheatersByTheaterLocation(@Param("location") String location);



}