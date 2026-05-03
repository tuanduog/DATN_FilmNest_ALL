package com.booking.booking_ticket.controller;

import java.util.List;

import com.booking.booking_ticket.dto.request.ChangePasswordRequest;
import com.booking.booking_ticket.dto.request.UserRequest;
import com.booking.booking_ticket.dto.request.UserUpdateRequest;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.UserService;
import com.booking.booking_ticket.utils.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.booking.booking_ticket.entity.Users;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/v1")
    public ResponseData<?> getList(Pageable pageable, String keyword, Status status) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successfully", userService.getList(pageable, keyword, status));
    }

    @GetMapping("/v1/{id:\\d+}")
    public ResponseData<?> getById(@PathVariable Integer id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get user successfully", userService.getById(id));
    }

    @PostMapping("/v1")
    public ResponseData<?> addUser(@RequestBody UserRequest user) {
        userService.addUser(user);
        return new ResponseData<>(HttpStatus.OK.value(), "Add user successfully");
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateUser(@PathVariable Integer id, @RequestBody UserRequest user) {
        userService.updateUser(id, user);
        return new ResponseData<>(HttpStatus.OK.value(), "Update user successfully");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete user successfully");
    }

    @GetMapping("/v1/check-exist")
    public ResponseData<?> checkUserExist(@RequestParam String username) {
        return new ResponseData<>(HttpStatus.OK.value(), "Check user successfully", userService.checkExistUser(username));
    }

    @GetMapping("/v1/benefit")
    public ResponseData<?> getBenefits() {
        return new ResponseData<>(HttpStatus.OK.value(), "Get benefit successfully", userService.getBenefitsForUser());
    }

    @GetMapping("/v1/profile")
    public ResponseData<?> getUserProfile() {
        return new ResponseData<>(HttpStatus.OK.value(), "Get user profile successfully", userService.getUserProfile());
    }

    @PutMapping("/v1/profile")
    public ResponseData<?> updateUserProfile(@RequestBody UserUpdateRequest request) {
        userService.updateUserProfile(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update user profile successfully");
    }

    @PutMapping("/v1/change-password")
    public ResponseData<?> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Change password successfully");
    }
}
