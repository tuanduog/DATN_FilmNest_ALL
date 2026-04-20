package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.MembershipRequest;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/membership")
@CrossOrigin(origins = "http://localhost:5173")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;
//
//    @PutMapping("/add/{userId}")
//    public ResponseEntity<?> addMembership(@PathVariable Integer userId, @RequestBody MembershipRequest membership) {
//        try {
//            Users user = userService.addMem(userId, membership);
//            return ResponseEntity.ok(user);
//        } catch(Exception e){
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Failed to getbooking byshowtime: " + e.getMessage());
//        }
//    }
//
//    @GetMapping("/get-Membership/{userId}")
//    public ResponseEntity<?> getMembership(@PathVariable Integer userId) {
//        try {
//            MembershipDTO mem = userService.getUserMembership(userId);
//            return ResponseEntity.ok(mem);
//        } catch(Exception e){
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Failed to getuser membership: " + e.getMessage());
//        }
//    }

}
