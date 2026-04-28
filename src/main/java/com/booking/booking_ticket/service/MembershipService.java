package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.MembershipRequest;
import com.booking.booking_ticket.dto.response.MembershipResponse;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MembershipService {

    public Page<MembershipResponse> getList(Pageable pageable, String keyword, Status status);

    public void addMembership(MembershipRequest request);

    public void updateMembership(Integer id, MembershipRequest request);

    public MembershipResponse getById(Integer id);

    public void deleteMembership(Integer id);

    public List<MembershipResponse> getAll();

    public MembershipResponse getByUserId();

    public void addPayment(Integer userId, Integer membershipId);
}
