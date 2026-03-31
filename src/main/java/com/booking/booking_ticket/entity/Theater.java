package com.booking.booking_ticket.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Table(name = "theater")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Theater extends BaseEntity {

    String name;

    Integer provinceCode;

    String provinceName;

    Integer districtCode;

    String districtName;

    String address;

    @Column(columnDefinition = "TEXT")
    String description;

    String hotline;

    Double latitude;

    Double longitude;

    @Column(name = "place_id")
    Integer placeId;

    @Column(name = "open_time")
    String openTime;

    @Column(name = "close_time")
    String closeTime;
}
