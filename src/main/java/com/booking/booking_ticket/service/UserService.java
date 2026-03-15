package com.booking.booking_ticket.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.booking.booking_ticket.dto.MembershipDTO;
import com.booking.booking_ticket.dto.request.MembershipRequest;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.UsersRepository;

@Service
public class UserService {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Users getByUsername (String userName){
        Optional<Users> users = usersRepository.findByUsername(userName);
        if(users.isPresent()){
            return users.get();
        }
        return null;
    }

    public Users updateProfile (Users new_User){
        return usersRepository.findByUsername(new_User.getUsername()).map(u -> {
            u.setEmail(new_User.getEmail());
            if(new_User.getPassword() != null && !new_User.getPassword().isBlank()){
                u.setPassword(passwordEncoder.encode(new_User.getPassword()));
            }
            u.setPhone(new_User.getPhone());
            u.setDob(new_User.getDob());
            u.setGender(new_User.getGender());
            u.setNationality(new_User.getNationality());
            return usersRepository.save(u);
        }).orElseThrow(() -> new UsernameNotFoundException("Khong tim thay user!"));
    }

    public Users updateMembership (Integer userId, MembershipRequest membership){
        return usersRepository.findByUserId(userId).map(u -> {
            u.setMembership(membership.getVip());
            u.setStartDate(membership.getStartDate());
            u.setExpired(membership.getExpire());
            return usersRepository.save(u);
        }).orElseThrow(() -> new UsernameNotFoundException("Khong tim thay user!"));
    }

    public MembershipDTO getUserMembership(Integer userId){
        Users users = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

        return new MembershipDTO(
            users.getUserId(),
            users.getMembership(),
            users.getStartDate(),
            users.getExpired()
        );
    }


    public List<Users> getAllUser(){
        return usersRepository.findAll();
    }

}
