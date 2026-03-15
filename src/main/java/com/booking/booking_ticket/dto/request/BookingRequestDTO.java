package com.booking.booking_ticket.dto.request;


import com.booking.booking_ticket.entity.Movies;
import com.booking.booking_ticket.entity.Theaters;
import com.booking.booking_ticket.entity.Users;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class BookingRequestDTO implements Serializable {

    private Integer bookingId;

    private String chair;

    private Double totalPrice;

    private String commbo;

    private Theaters theater;

    private Users user;

    private String movieName;

}
