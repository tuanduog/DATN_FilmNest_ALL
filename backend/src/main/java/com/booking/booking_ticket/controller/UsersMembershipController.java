package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.MembershipService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/user-membership")
public class UsersMembershipController {

    private final MembershipService membershipService;

    @PostMapping("/v1/payment/{userId}/{membershipId}")
    public ResponseData<?> addPayment(@PathVariable Integer userId, @PathVariable Integer membershipId) {
        membershipService.addPayment(userId, membershipId);
        return new ResponseData<>(HttpStatus.OK.value(), "Add payment successfully");
    }
}
