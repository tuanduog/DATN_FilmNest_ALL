package com.booking.booking_ticket.utils;

import com.booking.booking_ticket.dto.request.ShowTimeRequest;
import com.booking.booking_ticket.entity.Employee;
import com.booking.booking_ticket.entity.ShowTime;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.EmployeeRepository;
import com.booking.booking_ticket.repository.ShowTimeRepository;
import com.booking.booking_ticket.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class Util {

    private final UsersRepository usersRepository;

    private final EmployeeRepository employeeRepository;

    private final ShowTimeRepository showTimeRepository;

    public void validateUser(String username, String email, String phone, Integer id){
        Optional<Users> user = usersRepository.validateUsername(username, id);
        if(user.isPresent()){
            throw new RuntimeException("Username already exists");
        }
        Optional<Users> user2 = usersRepository.findByEmail(email, id);
        if(user2.isPresent()){
            throw new RuntimeException("Email already exists");
        }
        Optional<Users> user3 = usersRepository.findByPhone(phone, id);
        if(user3.isPresent()){
            throw new RuntimeException("Phone already exists");
        }
    }

    public void validateExistUsername(String username, String newUsername, Integer id){
        if(!username.equals(newUsername)){
            Optional<Users> user = usersRepository.validateUsername(username, id);
            if(user.isPresent()){
                throw new RuntimeException("Username already exists");
            }
        }
    }

    public void validateEmployeeCode(String code, Integer id){
        Optional<Employee> employee = employeeRepository.validateCode(code, id);
        if(employee.isPresent()){
            throw new RuntimeException("Employee code already exists");
        }
    }

    public void validateExistEmail(String email, String newEmail, Integer id){
        if(!email.equals(newEmail)){
            Optional<Users> user = usersRepository.findByEmail(email, id);
            if(user.isPresent()){
                throw new RuntimeException("Email already exists");
            }
        }
    }

    public void validateExistPhone(String phone, String newPhone, Integer id){
        if(!phone.equals(newPhone)){
            Optional<Users> user = usersRepository.findByPhone(phone, id);
            if(user.isPresent()){
                throw new RuntimeException("Phone already exists");
            }
        }
    }

    public void validateShowTime(ShowTimeRequest request, Integer id){
        Optional<ShowTime> showTime = showTimeRepository.validateShowTime(request.getShowDate(), request.getStartTime(), request.getMovieId(), request.getRoomId(), id);
        if (showTime.isPresent()) {
            throw new RuntimeException("Show time already exists");
        }
    }
}
