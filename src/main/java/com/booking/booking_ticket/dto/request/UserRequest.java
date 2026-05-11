package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.utils.Gender;
import com.booking.booking_ticket.utils.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest implements Serializable {

    String username;

    String email;

    String fullname;

    String phone;

    Gender gender;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;

    String nationality;

    String status;
}
