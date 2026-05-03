package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.VoucherRequest;
import com.booking.booking_ticket.dto.response.PublicVoucherResponse;
import com.booking.booking_ticket.dto.response.VoucherResponse;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.VoucherType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VoucherService {

    public Page<VoucherResponse> getList(Pageable pageable, String keyword, VoucherType type, Status status);

    public void addVoucher(VoucherRequest request);

    public void updateVoucher(Integer id, VoucherRequest request);

    public VoucherResponse getById(Integer id);

    public void deleteVoucher(Integer id);

    public List<PublicVoucherResponse> getPublicVouchers();
}
