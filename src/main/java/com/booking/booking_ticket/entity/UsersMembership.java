package com.booking.booking_ticket.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_membership")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsersMembership extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_id")
    private Membership membership;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime expiredDate;

    @Column(name = "auto_renew")
    private Boolean autoRenew;

    @Column(name = "price_paid")
    private Double pricePaid;
}
