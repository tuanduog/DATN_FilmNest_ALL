package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.UsersMembership;
import com.booking.booking_ticket.utils.MembershipPaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UsersMembershipRepository extends JpaRepository<UsersMembership, Integer> {

    @Query("""
        SELECT um
        FROM UsersMembership um
        WHERE um.user.id = :userId
            AND um.membershipPaymentStatus = :paymentStatus
    """)
    Optional<UsersMembership> findByUserId(Integer userId, MembershipPaymentStatus paymentStatus);
}
