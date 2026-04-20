package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.Gender;
import com.booking.booking_ticket.utils.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Users extends BaseEntity {

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone", length = 50, nullable = false)
    private String phone;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "nationality")
    private String nationality;

    @Column(name = "role", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;
}
