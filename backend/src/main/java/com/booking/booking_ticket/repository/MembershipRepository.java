package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.MembershipResponse;
import com.booking.booking_ticket.entity.Membership;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Integer> {

//    @Query("""
//        SELECT new com.booking.booking_ticket.dto.response.MembershipResponse(m.type, m.startDate, m.expiredDate)
//        FROM Membership m
//        WHERE m.user.id = :userId
//        AND m.status = :status
//    """)
//    List<MembershipResponse> findByUserIdAndStatus(Integer userId, int status);

    Optional<Membership> findByName(String name);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.MembershipResponse(m.id, m.name, m.type, m. price, m.duration, m.status)
        FROM Membership m
        WHERE (LOWER(m.name) LIKE :keyword)
        AND (:status IS NULL OR m.status = :status)
    """)
    Page<MembershipResponse> getList(Pageable pageable, String keyword, Status status);

    @Query("""
        SELECT m
        FROM Membership m
            WHERE m.status = :status
    """)
    List<Membership> findAllMembership(Status status);
}
