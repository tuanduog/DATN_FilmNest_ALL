package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.Gender;
import com.booking.booking_ticket.utils.Role;
import com.booking.booking_ticket.utils.Status;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {

    Integer id;

    String username;

    String email;

    String fullname;

    String phone;

    Gender gender;

    LocalDate dob;

    String nationality;

    Role role;

    Status status;
}
