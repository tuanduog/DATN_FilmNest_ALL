package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.MembershipRequest;
import com.booking.booking_ticket.dto.response.MembershipResponse;
import com.booking.booking_ticket.entity.Membership;
import com.booking.booking_ticket.repository.MembershipRepository;
import com.booking.booking_ticket.service.MembershipService;
import com.booking.booking_ticket.utils.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MembershipServiceImpl implements MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    @Override
    public Page<MembershipResponse> getList(Pageable pageable, String keyword, Status status){
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return membershipRepository.getList(pageable, keyword, status);
    }

    @Override
    public void addMembership(MembershipRequest request){
        Optional<Membership> checkValid = membershipRepository.findByName(request.getName());
        if (checkValid.isPresent()){
            throw new IllegalArgumentException("Gói thành viên này đã tồn tại rồi");
        }
        Membership membership = new Membership();

        membership.setImage(request.getImage());
        membership.setName(request.getName());
        membership.setType(request.getType());
        membership.setPrice(request.getPrice());
        membership.setDiscount(request.getDiscount());
        membership.setDuration(request.getDuration());
        membership.setDescription(request.getDescription());
        membership.setStatus(Status.ACTIVE);

        membershipRepository.save(membership);
    }

    @Override
    public void updateMembership(Integer id, MembershipRequest request){
        Membership membership = membershipRepository.getOne(id);

        if (request.getImage() != null){
            membership.setImage(request.getImage());
        }

        if (request.getName() != null){
            membership.setName(request.getName());
        }

        if (request.getType() != null){
            membership.setType(request.getType());
        }

        if (request.getPrice() != null){
            membership.setPrice(request.getPrice());
        }

        if (request.getDiscount() != null){
            membership.setDiscount(request.getDiscount());
        }

        if (request.getDuration() != null){
            membership.setDuration(request.getDuration());
        }

        if (request.getDescription() != null){
            membership.setDescription(request.getDescription());
        }

        membershipRepository.save(membership);
    }

    @Override
    public MembershipResponse getById(Integer id){
        Membership membership = membershipRepository.getById(id);

        MembershipResponse response = new MembershipResponse();
        if (membership != null){
            response.setId(membership.getId());
            response.setName(membership.getName());
            response.setType(membership.getType());
            response.setPrice(membership.getPrice());
            response.setDiscount(membership.getDiscount());
            response.setDuration(membership.getDuration());
            response.setDescription(membership.getDescription());
            response.setStatus(membership.getStatus());
        } else return null;

        return response;
    }

    @Override
    public void deleteMembership(Integer id){
        Optional<Membership> membership = membershipRepository.findById(id);
        if (membership.isPresent()){
            membership.get().setStatus(Status.INACTIVE);
            membershipRepository.save(membership.get());
        }
    }
}
