package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.entity.ShowTime;
import com.booking.booking_ticket.entity.Voucher;
import com.booking.booking_ticket.utils.PaymentStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {

    Integer id;

    String username;

    String code;

    String chair;

    Double totalPrice;

    PaymentStatus paymentStatus;

    ShowTimeResponse showTime;

    List<BookingComboResponse> bookingCombos;

    List<Voucher> vouchers;

    public OrderResponse(Integer id, String username, String code, String chair, Double totalPrice, PaymentStatus paymentStatus) {
        this.id = id;
        this.username = username;
        this.code = code;
        this.chair = chair;
        this.totalPrice = totalPrice;
        this.paymentStatus = paymentStatus;
    }
}
