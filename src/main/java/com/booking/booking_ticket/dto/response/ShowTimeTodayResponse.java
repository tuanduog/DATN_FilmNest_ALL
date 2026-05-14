package com.booking.booking_ticket.dto.response;

import com.booking.booking_ticket.utils.ShowingStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimeTodayResponse {

    LocalTime startTime;

    String movieName;

    String roomName;

    Integer capacity;

    Integer tickets;

    ShowingStatus showingStatus;
}
