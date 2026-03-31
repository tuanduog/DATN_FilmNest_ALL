package com.booking.booking_ticket.service;

import com.booking.booking_ticket.entity.Users;

import java.util.List;

public interface UserService {

    public Users getByUsername (String userName);

    public Users updateProfile (Users new_User);

    public List<Users> getAllUser();
}
