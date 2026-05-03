package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.VoucherRequest;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.VoucherService;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.VoucherType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/voucher")
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable,
                                   @RequestParam(required = false) String keyword,
                                   @RequestParam(required = false) VoucherType type,
                                   @RequestParam(required = false) Status status){
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successful", voucherService.getList(pageable, keyword, type, status));
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK.value(), "Get voucher successful", voucherService.getById(id));
    }

    @PostMapping("/v1")
    public ResponseData<?> addRoom(@RequestBody VoucherRequest request){
        voucherService.addVoucher(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Add voucher successful");
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateRoom(@PathVariable Integer id, @RequestBody VoucherRequest request){
        voucherService.updateVoucher(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update voucher successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteRoom(@PathVariable Integer id){
        voucherService.deleteVoucher(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete voucher successful");
    }

    @GetMapping("/v1/public")
    public ResponseData<?> getPublicVoucher(){
        return new ResponseData<>(HttpStatus.OK.value(), "Get public voucher successful", voucherService.getPublicVouchers());
    }
}
