package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.MembershipDTO;
import com.booking.booking_ticket.dto.request.MembershipRequest;
import com.booking.booking_ticket.entity.Users;

import java.util.List;

public interface UserService {

    public Users getByUsername (String userName);

    public Users updateProfile (Users new_User);

    public Users updateMembership (Integer userId, MembershipRequest membership);

    public MembershipDTO getUserMembership(Integer userId);

    public List<Users> getAllUser();
}
