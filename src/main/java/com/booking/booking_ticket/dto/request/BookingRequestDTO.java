package com.booking.booking_ticket.dto.request;

import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.entity.Users;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRequestDTO implements Serializable {

    Integer bookingId;

    String chair;

    Double totalPrice;

    String combo;

    Theater theater;

    Users user;

    String movieName;
}
