package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class IntrospectiveResponse {

    private Boolean isValid;

    private Integer userId;

    private String username;

    private String email;

    private String phoneNumber;

    private String membership;

    private String role;
}
