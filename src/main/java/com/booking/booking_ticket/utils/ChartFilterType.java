package com.booking.booking_ticket.utils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum ChartFilterType {

    TODAY("today"), WEEK("week"), MONTH("month"), YEAR("year");

    private final String value;

    ChartFilterType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ChartFilterType fromValue(String value) {
        return Arrays.stream(ChartFilterType.values())
                .filter(s -> s.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid type " + value));
    }
}
