package com.booking.booking_ticket.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthRequest implements Serializable {

    @NotEmpty(message = "Username is required")
    String username;

    @NotEmpty(message = "Password is required")
    String password;
}
