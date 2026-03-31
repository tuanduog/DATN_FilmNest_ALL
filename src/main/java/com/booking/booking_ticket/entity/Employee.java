package com.booking.booking_ticket.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "employee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Employee extends BaseEntity{

    @OneToOne
    @JoinColumn(name = "user_id")
    Users user;

    String code;

    Double salary;

    LocalDate hireAt;

    @ManyToOne
    @JoinColumn(name = "theater_id")
    Theater theater;
}
