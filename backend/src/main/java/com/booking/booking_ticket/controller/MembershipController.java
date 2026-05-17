package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.MembershipRequest;
import com.booking.booking_ticket.dto.response.MembershipResponse;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.MembershipService;
import com.booking.booking_ticket.utils.MembershipType;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/membership")
public class MembershipController {

    private final MembershipService membershipService;

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable,
                                   @RequestParam(required = false) String keyword,
                                   @RequestParam(required = false) Status status,
                                   @RequestParam(required = false)MembershipType type){
        Page<MembershipResponse> data = membershipService.getList(pageable, keyword, status, type);
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
    public ResponseData<?> updateMembership(@PathVariable Integer id, @RequestBody MembershipRequest request){
        membershipService.updateMembership(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update Membership Successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteMembership(@PathVariable Integer id){
        membershipService.deleteMembership(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete Membership Successful");
    }

    @GetMapping("/v1/all")
    public ResponseData<?> getAll(){
        return new ResponseData<>(HttpStatus.OK.value(), "Get All Membership Successful", membershipService.getAll());
    }

    @GetMapping("/v1/user")
    public ResponseData<?> getByUserId(){
        return new ResponseData<>(HttpStatus.OK.value(), "Get user membership successful", membershipService.getByUserId());
    }
}
