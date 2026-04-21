package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.MembershipType;
import com.booking.booking_ticket.utils.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MembershipResponse {

    int id;

    String image;

    String name;

    MembershipType type;

    Double price;

    Integer discount;

    Integer duration;

    String description;

    Status status;

    public MembershipResponse(String name, MembershipType type, Double price, Integer discount, Integer duration, String description) {
        this.name = name;
        this.type = type;
        this.price = price;
        this.discount = discount;
        this.duration = duration;
        this.description = description;
    }
}
