package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Users getByUsername (String userName){
        Optional<Users> users = usersRepository.findByUsername(userName);
        if(users.isPresent()){
            return users.get();
        }
        return null;
    }

    @Override
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

    @Override
    public List<Users> getAllUser(){
        return usersRepository.findAll();
    }
}
