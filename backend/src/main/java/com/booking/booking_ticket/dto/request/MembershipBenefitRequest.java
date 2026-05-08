package com.booking.booking_ticket.dto.request;

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
public class MembershipBenefitRequest {

    Integer id;

    BenefitType type;

    String description;

    Integer benefitRefId;

    Integer quantity;
}
