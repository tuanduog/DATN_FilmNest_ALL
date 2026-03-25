package com.booking.booking_ticket.dto;

import com.booking.booking_ticket.utils.Role;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {

    Integer userId;

    String username;

    String email;

    String phone;

    String membership;

    Role role;
}
