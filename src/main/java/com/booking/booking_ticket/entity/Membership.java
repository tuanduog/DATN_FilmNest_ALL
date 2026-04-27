package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.MembershipType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "membership")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Membership extends BaseEntity{

    String image;

    String name;

    @Enumerated(EnumType.STRING)
    MembershipType type;

    Double price;

    Integer duration;
}
