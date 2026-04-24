package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.BannerRequest;
import com.booking.booking_ticket.dto.response.BannerResponse;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.BannerService;
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
@RequestMapping("/api/banner")
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable, @RequestParam(required = false) String keyword, @RequestParam(required = false) Status status){
        Page<BannerResponse> data = bannerService.getList(pageable, keyword, status);
        return new ResponseData<>(HttpStatus.OK.value(), "Get List Successful", data);
    }

    @PostMapping("/v1")
    public ResponseData<?> addCombo(@RequestBody BannerRequest request){
        bannerService.addBanner(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Add Banner Successful");
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK.value(), "Get Banner Successful", bannerService.getById(id));
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateBanner(@PathVariable Integer id, @RequestBody BannerRequest request){
        bannerService.updateBanner(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update Banner Successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteBanner(@PathVariable Integer id){
        bannerService.deleteBanner(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete Banner Successful");
    }
}
