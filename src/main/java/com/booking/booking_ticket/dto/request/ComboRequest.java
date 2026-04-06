package com.booking.booking_ticket.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ComboRequest {

    String image;

    String name;

    Double price;

    String description;
}
