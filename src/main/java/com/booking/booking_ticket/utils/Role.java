package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Role {

    @JsonProperty("administrator")
    ADMINISTRATOR,

    @JsonProperty("manager")
    MANAGER,

    @JsonProperty("staff")
    STAFF,

    @JsonProperty("user")
    USER
}
