package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.utils.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequestDTO implements Serializable {

    Integer userId;

    String username;

    String password;

    String email;

    String phone;

    String membership;

    Role role;
}
