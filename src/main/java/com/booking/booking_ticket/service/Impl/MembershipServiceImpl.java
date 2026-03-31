package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.MembershipRequest;
import com.booking.booking_ticket.dto.response.MembershipResponse;
import com.booking.booking_ticket.entity.Membership;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.MembershipRepository;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MembershipServiceImpl implements MembershipService {

    @Autowired
    MembershipRepository membershipRepository;

    @Autowired
    UsersRepository usersRepository;

    @Override
    public void addMembership (Integer userId, MembershipRequest membership){
        List<MembershipResponse> response = membershipRepository.findByUserIdAndStatus(userId);
        if(response.isEmpty()){
            Membership m = new Membership();
            m.setType(membership.getType());
            m.setStartDate(membership.getStartDate());
            m.setExpiredDate(membership.getExpiredDate());

            Users user = usersRepository.getReferenceById(userId);
            m.setUser(user);
            membershipRepository.save(m);
        }
    }

    @Override
    public MembershipResponse getUserMembership(Integer userId){
        List<MembershipResponse> response = membershipRepository.findByUserIdAndStatus(userId);

        return response.get(0);
    }
}
