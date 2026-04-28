package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.BenefitType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "membership_benefit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MembershipBenefit extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_id")
    private Membership membership;

    @Enumerated(EnumType.STRING)
    BenefitType type;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(name = "benefit_ref_id")
    Integer benefitRefId;

    Integer quantity;
}
