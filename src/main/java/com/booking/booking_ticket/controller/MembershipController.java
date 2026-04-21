package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.ComboRequest;
import com.booking.booking_ticket.dto.request.MembershipRequest;
import com.booking.booking_ticket.dto.response.ComboResponse;
import com.booking.booking_ticket.dto.response.MembershipResponse;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.service.MembershipService;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/membership")
public class MembershipController {

    private final MembershipService membershipService;
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

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable, @RequestParam(required = false) String keyword, @RequestParam(required = false) Status status){
        Page<MembershipResponse> data = membershipService.getList(pageable, keyword, status);
        return new ResponseData<>(HttpStatus.OK.value(), "Get List Successful", data);
    }

    @PostMapping("/v1")
    public ResponseData<?> addMembership(@RequestBody MembershipRequest request){
        membershipService.addMembership(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Add Membership Successful");
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK.value(), "Get Membership Successful", membershipService.getById(id));
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateMembership(@PathVariable Integer id, MembershipRequest request){
        membershipService.updateMembership(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update Membership Successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteMembership(@PathVariable Integer id){
        membershipService.deleteMembership(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete Membership Successful");
    }
}
