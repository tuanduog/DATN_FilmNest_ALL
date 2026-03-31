package com.booking.booking_ticket.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RegisterRequestDTO implements Serializable {

    @NotEmpty(message = "Username is required")
    private String username;

    @Email
    @NotEmpty(message = "Email is required")
    private String email;

    @NotEmpty(message = "Password is required")
    private String password;

    @NotEmpty(message = "Confirm password is required")
    private String retypePassword;

    @NotEmpty(message = "Phone number is required")
    private String phone;
}
