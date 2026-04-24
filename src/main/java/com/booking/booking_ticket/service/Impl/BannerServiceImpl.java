package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.BannerRequest;
import com.booking.booking_ticket.dto.response.BannerResponse;
import com.booking.booking_ticket.entity.Banner;
import com.booking.booking_ticket.repository.BannerRepository;
import com.booking.booking_ticket.service.BannerService;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    private final Util util;

    public Page<BannerResponse> getList(Pageable pageable, String keyword, Status status) {
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return bannerRepository.getList(pageable, keyword, status);
    }

    public void addBanner(BannerRequest request){
        util.validateBanner(request.getName(), null);
        Banner banner = new Banner();
        banner.setName(request.getName());
        banner.setImage(request.getImage());
        banner.setStatus(Status.ACTIVE);

        bannerRepository.save(banner);
    }

    public BannerResponse getById(Integer id){
        Banner banner = bannerRepository.findById(id).orElseThrow(() -> new RuntimeException("Banner does not exist"));
        BannerResponse response = new BannerResponse();
        response.setId(banner.getId());
        response.setName(banner.getName());
        response.setImage(banner.getImage());
        response.setCreatedAt(banner.getCreatedAt());
        response.setUpdatedAt(banner.getUpdatedAt());
        response.setStatus(banner.getStatus());

        return response;
    }

    public void updateBanner(Integer id, BannerRequest request){
        util.validateBanner(request.getName(), id);
        Banner banner = new Banner();
        if(request.getName() != null){
            banner.setName(request.getName());
        }
        if(request.getImage() != null){
            banner.setImage(request.getImage());
        }

        bannerRepository.save(banner);
    }

    public void deleteBanner(Integer id){
        Banner banner = bannerRepository.findById(id).orElseThrow(() -> new RuntimeException("Banner does not exist"));
        banner.setStatus(Status.INACTIVE);
        bannerRepository.save(banner);
    }
}
