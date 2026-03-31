package com.booking.booking_ticket.utils;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum Gender {

    MALE("male"), FEMALE("female"), OTHER("other");

    private final String value;

    Gender(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
