package com.booking.booking_ticket.dto.response;

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
public class VoucherResponse {

    Integer id;

    String code;

    VoucherType type;

    String description;

    LocalDate startDate;

    LocalDate endDate;

    Double discount;

    Integer quantity;

    Double minOrderValue;

    Status status;

    public VoucherResponse(Integer id, String code, VoucherType type, Double discount, LocalDate startDate, LocalDate endDate, Integer quantity, Status status) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.quantity = quantity;
        this.status = status;
    }
}
