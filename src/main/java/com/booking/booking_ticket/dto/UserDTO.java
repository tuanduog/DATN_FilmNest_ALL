package com.booking.booking_ticket.dto;

import com.booking.booking_ticket.utils.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Integer userId;
    private String username;
    private String email;
    private String phone;
    private String membership;
    private UserRole userRole;
}
