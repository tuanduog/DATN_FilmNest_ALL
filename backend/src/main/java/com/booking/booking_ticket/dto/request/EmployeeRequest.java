package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.utils.Gender;
import com.booking.booking_ticket.utils.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeRequest {

    String username;

    String fullname;

    String code;

    String email;

    String phone;

    Gender gender;

    LocalDate dob;

    String nationality;

    Role role;

    Double salary;

    LocalDate hireAt;

    Integer userId;

    Integer theaterId;

    Integer managerId;
}
