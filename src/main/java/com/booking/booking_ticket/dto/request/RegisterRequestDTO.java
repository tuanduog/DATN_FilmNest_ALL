package com.booking.booking_ticket.dto.request;

import jakarta.validation.constraints.Email;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RegisterRequestDTO implements Serializable {

    private String firstName;

    private String lastName;

    @Email
    private String email;

    private Boolean gender;

    private String phone;

    private String username;

    private String password;

    private Instant createdAt;

    private String note;

}
