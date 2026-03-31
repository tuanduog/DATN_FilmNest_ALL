package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.response.MembershipResponse;
import com.booking.booking_ticket.entity.Membership;

public interface MembershipService {

    void addMembership(Membership membership);

    MembershipResponse getUserMembership(Membership membership);
}
