package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.utils.MembershipType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MembershipRequest {

    String image;

    String name;

    MembershipType type;

    Double price;

    Integer discount;

    Integer duration;

    String description;
}
