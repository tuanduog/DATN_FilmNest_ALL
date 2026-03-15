package com.booking.booking_ticket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MoviesWithRevenuesResponseDTO  implements Serializable {

    private String movieName;
    private Double revenueByMovie;
    private Long sold;
    private Double price;

}
