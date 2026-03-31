package com.booking.booking_ticket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MembershipResponse {

    String type;

    LocalDateTime startDate;

    LocalDateTime expiredDate;
}
