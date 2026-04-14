package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.Status;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TheaterResponse {

    Integer id;

    String name;

    String address;

    Integer provinceCode;

    String provinceName;

    Integer communeCode;

    String communeName;

    String description;

    String hotline;

    Double latitude;

    Double longitude;

    String placeId;

    LocalTime openTime;

    LocalTime closeTime;

    Status status;

    public TheaterResponse(Integer id, String name, String hotline, LocalTime openTime, LocalTime closeTime, Status status) {
        this.id = id;
        this.name = name;
        this.hotline = hotline;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.status = status;
    }
}
