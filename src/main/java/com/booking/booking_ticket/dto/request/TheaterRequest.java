package com.booking.booking_ticket.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TheaterRequest implements Serializable {

    String name;

    String address;

    String provinceCode;

    String provinceName;

    String communeCode;

    String communeName;

    String description;

    String hotline;

    Double latitude;

    Double longitude;

    String placeId;

    LocalTime openTime;

    LocalTime closeTime;
}
