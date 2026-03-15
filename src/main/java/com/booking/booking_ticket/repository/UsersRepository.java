package com.booking.booking_ticket.repository;


import com.booking.booking_ticket.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;


@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {


    Optional<Users> findByUsername(String username);;
    Optional<Users> findByUserId(Integer userId);
}
