package com.booking.booking_ticket.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LastSummaryResponse {

    Double totalRevenue;

    Long tickets;

    Long combos;

    BigDecimal avgOccupancy;
}
