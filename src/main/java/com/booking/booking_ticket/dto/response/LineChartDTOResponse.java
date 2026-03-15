package com.booking.booking_ticket.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class LineChartDTOResponse {
    private Double revenue;
    private Long a_cus;
}
