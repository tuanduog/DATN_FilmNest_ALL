package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum MembershipType {

    @JsonProperty("premium")
    PREMIUM,

    @JsonProperty("gold")
    GOLD,

    @JsonProperty("silver")
    SILVER
}
