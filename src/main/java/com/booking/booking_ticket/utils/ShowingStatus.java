package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ShowingStatus {

    @JsonProperty("COMING_SOON")
    COMING_SOON,

    @JsonProperty("NOW_SHOWING")
    NOW_SHOWING,

    @JsonProperty("STOP")
    STOP
}
