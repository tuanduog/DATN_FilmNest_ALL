package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.Status;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BannerResponse {

    Integer id;

    String image;

    String name;

    Instant createdAt;

    Instant updatedAt;

    Status status;
}
