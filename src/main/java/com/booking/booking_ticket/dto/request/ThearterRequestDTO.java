package com.booking.booking_ticket.dto.request;


import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ThearterRequestDTO implements Serializable {


    private Integer theaterId;

    private String theaterName;

    private String location;
}
