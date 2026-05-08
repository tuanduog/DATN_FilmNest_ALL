package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum SeatType {

    VIP("vip"), SWEETBOX("sweetbox"), STANDARD("standard");

    private final String value;

    SeatType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SeatType fromValue(String value) {
        return Arrays.stream(SeatType.values())
                .filter(s -> s.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status " + value));
    }
}
