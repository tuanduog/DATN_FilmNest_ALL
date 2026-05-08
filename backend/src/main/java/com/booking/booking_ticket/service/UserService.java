package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.ChangePasswordRequest;
import com.booking.booking_ticket.dto.request.UserRequest;
import com.booking.booking_ticket.dto.request.UserUpdateRequest;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.UserBenefitResponse;
import com.booking.booking_ticket.dto.response.UserResponse;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {

    public UserResponse getUserProfile();

    public void updateUserProfile(UserUpdateRequest request);

    public void changePassword(ChangePasswordRequest request);

    public Page<UserResponse> getList(Pageable pageable, String keyword, Status status);

    public UserResponse getById(Integer id);

    public void addUser(UserRequest request);

    public void updateUser(Integer id, UserRequest request);

    public void deleteUser(Integer id);

    public ResponseData<?> checkExistUser(String username);

    public UserBenefitResponse getBenefitsForUser();
}
