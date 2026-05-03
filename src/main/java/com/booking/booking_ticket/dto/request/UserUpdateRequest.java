package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.utils.Gender;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {

    String username;

    String fullname;

    String email;

    String phone;

    Gender gender;

    LocalDate dob;

    String nationality;
}
