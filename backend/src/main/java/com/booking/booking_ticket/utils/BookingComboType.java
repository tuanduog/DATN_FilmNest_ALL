package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum BookingComboType {

    FREE("free"), PAID("paid");

    private final String value;

    BookingComboType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static BookingComboType fromValue(String value) {
        return Arrays.stream(BookingComboType.values())
                .filter(s -> s.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status " + value));
    }
}
