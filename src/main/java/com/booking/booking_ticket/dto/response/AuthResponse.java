package com.booking.booking_ticket.dto.response;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {


    private String token;
    private Boolean isAuthenticated;
}
