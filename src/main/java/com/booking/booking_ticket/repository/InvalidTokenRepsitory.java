package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.InvalidToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface InvalidTokenRepsitory extends JpaRepository<InvalidToken, String> {


}
