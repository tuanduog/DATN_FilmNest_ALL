package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum MembershipType {

    PREMIUM("premium"), GOLD("gold"), SILVER("silver");

    private final String value;

    MembershipType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static MembershipType fromValue(String value) {
        return Arrays.stream(MembershipType.values())
                .filter(s -> s.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status " + value));
    }
}
