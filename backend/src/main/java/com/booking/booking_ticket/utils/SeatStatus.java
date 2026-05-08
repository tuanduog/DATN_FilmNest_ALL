package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum SeatStatus {

    ACTIVE("active"), DISABLED("disabled"), DELETED("deleted");

    private final String value;

    SeatStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SeatStatus fromValue(String value) {
        return Arrays.stream(SeatStatus.values())
                .filter(s -> s.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status " + value));
    }
}
