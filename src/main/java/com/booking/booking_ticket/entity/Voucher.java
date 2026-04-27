package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.VoucherType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "voucher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Voucher extends BaseEntity{

    String code;

    @Enumerated(EnumType.STRING)
    VoucherType type;

    String description;

    @Column(name = "start_date")
    LocalDate startDate;

    @Column(name = "end_date")
    LocalDate endDate;

    Double discount;

    Integer quantity; // số lượng max được dùng

    @Column(name = "min_order_value")
    Double minOrderValue;
}
