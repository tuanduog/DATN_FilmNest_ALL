package com.booking.booking_ticket.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalTime;

@Entity
@Table(name = "theater")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Theater extends BaseEntity {

    String name;

    @Column(name = "province_code")
    Integer provinceCode;

    @Column(name = "province_name")
    String provinceName;

    @Column(name = "commune_code")
    Integer communeCode;

    @Column(name = "commune_name")
    String communeName;

    String address;

    @Column(columnDefinition = "TEXT")
    String description;

    String hotline;

    Double latitude;

    Double longitude;

    @Column(name = "place_id")
    String placeId;

    @Column(name = "open_time")
    LocalTime openTime;

    @Column(name = "close_time")
    LocalTime closeTime;
}
