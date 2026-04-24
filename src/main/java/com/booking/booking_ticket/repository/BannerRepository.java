package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.BannerResponse;
import com.booking.booking_ticket.entity.Banner;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.BannerResponse(b.id, b.name, b.createdAt, b.updatedAt, b.status)
        FROM Banner b
        WHERE (LOWER(b.name) LIKE :keyword)
        AND (:status IS NULL OR b.status = :status)
    """)
    Page<BannerResponse> getList(Pageable pageable, String keyword, Status status);

    @Query("""
        SELECT b
        FROM Banner b
        WHERE b.name = :name
            AND (:id IS NULL OR b.id = :id)
    """)
    Optional<Banner> validateByName(String name, Integer id);
}
