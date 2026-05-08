package com.booking.booking_ticket.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "combo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Combo extends BaseEntity {

    String image;

    String name;

    Double price;

    @Column(columnDefinition = "TEXT")
    String description;
}
