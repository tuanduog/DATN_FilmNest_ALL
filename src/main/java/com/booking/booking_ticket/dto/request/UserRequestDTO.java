package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.utils.UserRole;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO implements Serializable {

    private Integer userId;

    private String username;

    private String password;

    private String email;

    private String phone;

    private String membership;

    private UserRole userRole;

}
