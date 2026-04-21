package com.booking.booking_ticket.controller;

import java.util.List;

import com.booking.booking_ticket.dto.request.UserRequest;
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

    @GetMapping("/get-Userprofile/{userName}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String userName) {
        try {
            Users user = userService.getByUsername(userName);
            return ResponseEntity.ok(user);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Failed to getbooking byshowtime: " + e.getMessage());
        }
    }
    
    @PutMapping("/update-Userprofile")
    public ResponseEntity<?> updateUserprofile(@RequestBody Users user) {
        try {
            Users users = userService.updateProfile(user);
            return ResponseEntity.ok(users);
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Failed to getbooking byshowtime: " + e.getMessage());
        }
    }

    @GetMapping("/getAllUser")
    public ResponseEntity<?> getUsers() {
        try {
            List<Users> mem = userService.getAllUser();
            return ResponseEntity.ok(mem);
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to getusers : " + e.getMessage());
        }
    }

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
}
