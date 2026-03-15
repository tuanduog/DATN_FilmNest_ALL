package com.booking.booking_ticket.service;



import com.booking.booking_ticket.dto.request.AuthRequestDTO;
import com.booking.booking_ticket.dto.request.RegisterRequestDTO;
import com.booking.booking_ticket.dto.response.IntrospectiveResponse;
import com.booking.booking_ticket.entity.Users;
import com.nimbusds.jose.JOSEException;
import com.booking.booking_ticket.dto.response.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.text.ParseException;


public interface AuthService {

    AuthResponse isAuthenticated(AuthRequestDTO authRequestDTO);
    String generateToken(Users users);
    IntrospectiveResponse introspect(HttpServletRequest request) throws JOSEException, ParseException;
    long registerCustomer(RegisterRequestDTO registerRequestDTO);
    boolean logout(HttpServletRequest request);

}
