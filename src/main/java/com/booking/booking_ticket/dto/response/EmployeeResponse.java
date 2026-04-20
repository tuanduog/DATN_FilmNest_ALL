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

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeResponse {

    Integer id;

    String code;

    Double salary;

    LocalDate hireAt;

    String email;

    String phone;

    Role role;

    Status status;

    LocalDate dob;

    Gender gender;

    String nationality;

    public EmployeeResponse(Integer id, String code, Double salary, LocalDate hireAt, String email, String phone, Role role, Status status) {
        this.id = id;
        this.code = code;
        this.salary = salary;
        this.hireAt = hireAt;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.status = status;
    }
}
