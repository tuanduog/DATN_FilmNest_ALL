package com.booking.booking_ticket.dto;

import java.time.OffsetDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MembershipDTO {

    Integer userId;

    String membership;

    OffsetDateTime startDate;

    Integer expired;
}
