package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.BannerRequest;
import com.booking.booking_ticket.dto.response.BannerResponse;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BannerService {

    public Page<BannerResponse> getList(Pageable pageable, String keyword, Status status);

    public void addBanner(BannerRequest request);

    public void deleteBanner(Integer id);

    public void updateBanner(Integer id, BannerRequest request);

    public BannerResponse getById(Integer id);
}
