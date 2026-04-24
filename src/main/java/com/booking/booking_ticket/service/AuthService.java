package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.AuthRequest;
import com.booking.booking_ticket.dto.request.RegisterRequest;
import com.booking.booking_ticket.dto.response.IntrospectiveResponse;
import com.booking.booking_ticket.entity.Users;
import com.nimbusds.jose.JOSEException;
import com.booking.booking_ticket.dto.response.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.text.ParseException;

public interface AuthService {

    AuthResponse isAuthenticated(AuthRequest authRequest);

    String generateToken(Users users);

    IntrospectiveResponse introspect(HttpServletRequest request) throws JOSEException, ParseException;

    void register(RegisterRequest registerRequest);

    boolean logout(HttpServletRequest request);
}
