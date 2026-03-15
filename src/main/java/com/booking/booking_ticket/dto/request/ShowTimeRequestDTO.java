package com.booking.booking_ticket.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ShowTimeRequestDTO implements Serializable {


    private LocalTime startTime;

    private Integer movieId;

    private Integer roomId;


}
