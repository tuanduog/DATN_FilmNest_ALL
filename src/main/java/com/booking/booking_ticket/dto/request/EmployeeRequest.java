package com.booking.booking_ticket.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeRequest {

    Integer userId;

    String code;

    Double salary;

    LocalDate hireAt;

    Integer theaterId;
}
