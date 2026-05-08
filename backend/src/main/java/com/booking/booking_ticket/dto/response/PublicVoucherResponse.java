package com.booking.booking_ticket.dto.response;

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
public class PublicVoucherResponse {

    Integer id;

    Double discount;

    LocalDate startDate;

    LocalDate endDate;

    Integer quantity;

    Double minOrderValue;

    String description;
}
