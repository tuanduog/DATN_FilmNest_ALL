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

    Integer duration;

    Status status;

    public MembershipResponse(int id, String name, MembershipType type, Double price, Integer duration, Status status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.price = price;
        this.duration = duration;
        this.status = status;
    }
}
