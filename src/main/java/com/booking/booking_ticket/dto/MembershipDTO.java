package com.booking.booking_ticket.dto;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MembershipDTO {
    private Integer userId;
    private String membership;
    private OffsetDateTime startDate;
    private Integer expired;
}
