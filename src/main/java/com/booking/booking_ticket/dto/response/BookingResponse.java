package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingResponse {

        private String username;

        private Double totalPrice;

        private String movieName;

        private PaymentStatus paymentStatus;
}
