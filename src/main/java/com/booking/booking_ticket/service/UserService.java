package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.UserRequest;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.UserResponse;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {

    public Users getByUsername (String userName);

    public Users updateProfile (Users new_User);

    public List<Users> getAllUser();

    public Page<UserResponse> getList(Pageable pageable, String keyword, Status status);

    public UserResponse getById(Integer id);

    public void addUser(UserRequest request);

    public void updateUser(Integer id, UserRequest request);

    public void deleteUser(Integer id);

    public ResponseData<?> checkExistUser(String username);
}
