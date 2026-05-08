package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.ComboRequest;
import com.booking.booking_ticket.dto.response.ComboResponse;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.ComboService;
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
@RequestMapping("/api/combo")
public class ComboController {

    private final ComboService comboService;

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable, @RequestParam(required = false) String keyword, @RequestParam(required = false) Status status){
        Page<ComboResponse> data = comboService.getList(pageable, keyword, status);
        return new ResponseData<>(HttpStatus.OK.value(), "Get List Successful", data);
    }

    @PostMapping("/v1")
    public ResponseData<?> addCombo(@RequestBody ComboRequest request){
        comboService.addCombo(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Add Combo Successful");
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK.value(), "Get Combo Successful", comboService.getById(id));
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateCombo(@PathVariable Integer id, @RequestBody ComboRequest request){
        comboService.updateCombo(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update Combo Successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteCombo(@PathVariable Integer id){
        comboService.deleteCombo(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete Combo Successful");
    }
}
