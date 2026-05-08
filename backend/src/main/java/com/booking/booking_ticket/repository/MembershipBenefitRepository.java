package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.MembershipBenefit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipBenefitRepository extends JpaRepository<MembershipBenefit, Integer> {

    List<MembershipBenefit> findByMembership_Id(Integer id);
}
