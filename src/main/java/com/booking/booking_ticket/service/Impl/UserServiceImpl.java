package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.UserRequest;
import com.booking.booking_ticket.dto.response.UserResponse;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.service.UserService;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Autowired
    private Util util;

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

    @Override
    public Page<UserResponse> getList(Pageable pageable, String keyword, Status status){
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return usersRepository.findAllByKeyword(pageable, keyword, status);
    }

    @Override
    public UserResponse getById(Integer id){
        Users user = usersRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Username not exists!"));
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setDob(user.getDob());
        response.setGender(user.getGender());
        response.setNationality(user.getNationality());
        response.setRole(user.getRole());
        return response;
    }

    @Override
    public void addUser(UserRequest request){
        util.validateUser(request.getUsername(), request.getEmail(), request.getPhone());
        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode("123456"));
        user.setPhone(request.getPhone());
        user.setDob(request.getDob());
        user.setGender(request.getGender());
        user.setNationality(request.getNationality());
        user.setRole(request.getRole());
        user.setStatus(Status.ACTIVE);
        usersRepository.save(user);
    }

    @Override
    public void updateUser(Integer id, UserRequest request){
        Users user = usersRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Username not exists!"));
        util.validateExistUsername(user.getUsername(), request.getUsername());
        util.validateExistEmail(user.getEmail(), request.getEmail());
        util.validateExistPhone(user.getPhone(), request.getPhone());

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setDob(request.getDob());
        user.setGender(request.getGender());
        user.setNationality(request.getNationality());
        user.setRole(request.getRole());
        usersRepository.save(user);
    }

    @Override
    public void deleteUser(Integer id){
        Users user = usersRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Username not exists"));
        user.setStatus(Status.INACTIVE);
        usersRepository.save(user);
    }
}
