package com.booking.booking_ticket.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimeRequestDTO implements Serializable {

    LocalTime startTime;

    Integer movieId;

    Integer roomId;
}
