package com.booking.booking_ticket.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ThearterRequest implements Serializable {

    Integer theaterId;

    String theaterName;

    String location;
}
