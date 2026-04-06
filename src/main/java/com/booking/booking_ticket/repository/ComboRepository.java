package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.ComboResponse;
import com.booking.booking_ticket.entity.Combo;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Integer> {

    Optional<Combo> findByName(String name);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.ComboResponse(c.id, c.image, c.name, c.price, c.description, c.status)
        FROM Combo c
        WHERE (LOWER(c.name) LIKE :keyword)
        AND (:status IS NULL OR c.status = :status)
    """)
    Page<ComboResponse> getList(Pageable pageable, String keyword, Status status);
}
