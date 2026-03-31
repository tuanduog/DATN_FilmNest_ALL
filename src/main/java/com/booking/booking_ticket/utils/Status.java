package com.booking.booking_ticket.utils;

public enum Status {

    INACTIVE("inactive"), ACTIVE("active");

    private final String value;

    Status(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
