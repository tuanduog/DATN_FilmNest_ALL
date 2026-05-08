package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.entity.Voucher;
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
public class UserBenefitResponse {

    List<VoucherUsageResponse> vouchers;

    List<ComboUsageResponse> combos;
}
