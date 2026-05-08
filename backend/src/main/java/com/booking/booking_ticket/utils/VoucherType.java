package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum VoucherType {

    PERSONAL("personal"), PUBLIC("public");

    private final String value;

    VoucherType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static VoucherType fromValue(String value) {
        return Arrays.stream(VoucherType.values())
                .filter(s -> s.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status " + value));
    }
}
