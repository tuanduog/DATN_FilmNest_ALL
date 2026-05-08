package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.utils.Status;
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
public class VoucherRequest {

    String code;

    VoucherType type;

    String description;

    LocalDate startDate;

    LocalDate endDate;

    Double discount;

    Integer quantity;

    Double minOrderValue;

    Status status;
}
