package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.entity.Combo;
import com.booking.booking_ticket.entity.Voucher;
import com.booking.booking_ticket.utils.BenefitType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MembershipBenefitResponse {

    Integer id;

    BenefitType type;

    String description;

    Integer quantity;

    Voucher voucher;

    Combo combo;
}
