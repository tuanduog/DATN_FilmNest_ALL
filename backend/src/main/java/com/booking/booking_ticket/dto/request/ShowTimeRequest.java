package com.booking.booking_ticket.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimeRequest implements Serializable {

    LocalDate showDate;

    LocalTime startTime;

    Double surcharge;

    Integer movieId;

    Integer roomId;
}
