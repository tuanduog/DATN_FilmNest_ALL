package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.MembershipBenefit;
import com.booking.booking_ticket.entity.UsersMembership;
import com.booking.booking_ticket.utils.BenefitType;
import com.booking.booking_ticket.utils.MembershipPaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UsersMembershipRepository extends JpaRepository<UsersMembership, Integer> {

    @Query("""
        SELECT um
        FROM UsersMembership um
        WHERE um.user.id = :userId
            AND um.membershipPaymentStatus = :paymentStatus
    """)
    Optional<UsersMembership> findByUserId(Integer userId, MembershipPaymentStatus paymentStatus);

    @Query("""
        SELECT mb
        FROM UsersMembership um
            JOIN MembershipBenefit mb ON mb.membership.id = um.membership.id
        WHERE um.user.id = :userId
            AND um.expiredDate > :now
            AND mb.type <> :type
    """)
    List<MembershipBenefit> findUserBenefit(Integer userId, LocalDateTime now, BenefitType type);
}
