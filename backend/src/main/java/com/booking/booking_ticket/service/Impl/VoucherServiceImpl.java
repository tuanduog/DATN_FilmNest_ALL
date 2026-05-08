package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.VoucherRequest;
import com.booking.booking_ticket.dto.response.PublicVoucherResponse;
import com.booking.booking_ticket.dto.response.VoucherResponse;
import com.booking.booking_ticket.entity.Voucher;
import com.booking.booking_ticket.repository.VoucherRepository;
import com.booking.booking_ticket.repository.VoucherUsageRepository;
import com.booking.booking_ticket.service.VoucherService;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.Util;
import com.booking.booking_ticket.utils.VoucherType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class VoucherServiceImpl implements VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherUsageRepository voucherUsageRepository;

    @Autowired
    private Util util;

    @Override
    public Page<VoucherResponse> getList(Pageable pageable, String keyword, VoucherType type, Status status) {
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return voucherRepository.findAllByKeyword(pageable, keyword, type, status);
    }

    @Override
    public void addVoucher(VoucherRequest request) {
        util.validateVoucher(request.getCode(), null);

        Voucher voucher = new Voucher();
        voucher.setCode(request.getCode());
        voucher.setType(request.getType());
        voucher.setDiscount(request.getDiscount());
        voucher.setDescription(request.getDescription());
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setQuantity(request.getQuantity());
        voucher.setMinOrderValue(request.getMinOrderValue());
        voucher.setStatus(request.getStatus());

        voucherRepository.save(voucher);
    }

    @Override
    public void updateVoucher(Integer id, VoucherRequest request) {
        util.validateVoucher(request.getCode(), id);

        Voucher voucher = voucherRepository.findById(id).orElseThrow(() -> new RuntimeException("Voucher does not exist"));
        if(request.getCode() != null){
            voucher.setCode(request.getCode());
        }

        if(request.getType() != null){
            voucher.setType(request.getType());
        }

        if(request.getDiscount() != null){
            voucher.setDiscount(request.getDiscount());
        }

        if (request.getType().equals(VoucherType.PERSONAL)){
            voucher.setQuantity(null);
            voucher.setMinOrderValue(null);
        } else {
            voucher.setQuantity(request.getQuantity());
            voucher.setMinOrderValue(request.getMinOrderValue());
        }

        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setStatus(request.getStatus());
        voucher.setDescription(request.getDescription());

        voucherRepository.save(voucher);
    }

    @Override
    public VoucherResponse getById(Integer id) {
        VoucherResponse response = new VoucherResponse();
        Voucher voucher = voucherRepository.findById(id).orElseThrow(() -> new RuntimeException("Voucher does not exist"));

        response.setId(voucher.getId());
        response.setCode(voucher.getCode());
        response.setDescription(voucher.getDescription());
        response.setDiscount(voucher.getDiscount());
        response.setQuantity(voucher.getQuantity());
        response.setStartDate(voucher.getStartDate());
        response.setEndDate(voucher.getEndDate());
        response.setType(voucher.getType());
        response.setMinOrderValue(voucher.getMinOrderValue());
        response.setStatus(voucher.getStatus());

        return response;
    }

    @Override
    public void deleteVoucher(Integer id) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(() -> new RuntimeException("Voucher does not exist"));
        voucher.setStatus(Status.INACTIVE);
        voucherRepository.save(voucher);
    }

    @Override
    public List<PublicVoucherResponse> getPublicVouchers() {
        List<PublicVoucherResponse> publicVouchers = new ArrayList<>();

        List<Voucher> vouchers = voucherRepository.getPublicVoucher(VoucherType.PUBLIC, Status.ACTIVE);
        for (Voucher voucher : vouchers) {
            boolean isValidDate;

            if (voucher.getStartDate() != null && voucher.getEndDate() != null) {
                isValidDate = voucher.getStartDate().isBefore(LocalDate.now()) && voucher.getEndDate().isAfter(LocalDate.now());
            } else {
                isValidDate = true;
            }

            boolean checkMaxUsed = checkMaxUsedVoucher(voucher.getId(), voucher.getQuantity());

            if (isValidDate && !checkMaxUsed) {
                PublicVoucherResponse publicVoucherResponse = new PublicVoucherResponse();
                publicVoucherResponse.setId(voucher.getId());
                publicVoucherResponse.setEndDate(voucher.getEndDate());
                publicVoucherResponse.setStartDate(voucher.getStartDate());
                publicVoucherResponse.setQuantity(voucher.getQuantity());
                publicVoucherResponse.setDescription(voucher.getDescription());
                publicVoucherResponse.setDiscount(voucher.getDiscount());
                publicVoucherResponse.setMinOrderValue(voucher.getMinOrderValue());
                publicVouchers.add(publicVoucherResponse);
            }
        }

        return publicVouchers;
    }

    public boolean checkMaxUsedVoucher(Integer voucherId, Integer quantity) {
        Integer countVoucherUsage = voucherUsageRepository.countVoucherUsage(voucherId);
        if (countVoucherUsage < quantity) {
            return false;
        } else  {
            return true;
        }
    }
}
