package com.booking.booking_ticket.utils;

import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class Util {

    private final UsersRepository usersRepository;

    public void validateUser(String username, String email, String phone){
        Optional<Users> user = usersRepository.findByUsername(username);
        if(user.isPresent()){
            throw new RuntimeException("Username already exists");
        }
        Optional<Users> user2 = usersRepository.findByEmail(email);
        if(user2.isPresent()){
            throw new RuntimeException("Email already exists");
        }
        Optional<Users> user3 = usersRepository.findByPhone(phone);
        if(user3.isPresent()){
            throw new RuntimeException("Phone already exists");
        }
    }

    public void validateExistUsername(String username, String newUsername){
        if(!username.equals(newUsername)){
            Optional<Users> user = usersRepository.findByUsername(username);
            if(user.isPresent()){
                throw new RuntimeException("Username already exists");
            }
        }
    }

    public void validateExistEmail(String email, String newEmail){
        if(!email.equals(newEmail)){
            Optional<Users> user = usersRepository.findByEmail(email);
            if(user.isPresent()){
                throw new RuntimeException("Email already exists");
            }
        }
    }

    public void validateExistPhone(String phone, String newPhone){
        if(!phone.equals(newPhone)){
            Optional<Users> user = usersRepository.findByPhone(phone);
            if(user.isPresent()){
                throw new RuntimeException("Phone already exists");
            }
        }
    }
}
