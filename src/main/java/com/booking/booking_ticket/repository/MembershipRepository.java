package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.MembershipResponse;
import com.booking.booking_ticket.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Integer> {

//    @Query("""
//        SELECT new com.booking.booking_ticket.dto.response.MembershipResponse(m.type, m.startDate, m.expiredDate)
//        FROM Membership m
//        WHERE m.user.id = :userId
//        AND m.status = :status
//    """)
//    List<MembershipResponse> findByUserIdAndStatus(Integer userId, int status);
}
