package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum RoomType {

    @JsonProperty("2D")
    TWOD,

    @JsonProperty("3D")
    THREED,

    @JsonProperty("IMAX")
    IMAX
}
