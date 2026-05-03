package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.VoucherType;
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
public class VoucherUsageResponse {

    Integer id;

    String code;

    String description;

    Double discount;

    VoucherType type;

    LocalDate startDate;

    LocalDate endDate;

    Double minOrderValue;

    Integer quantity;
}
