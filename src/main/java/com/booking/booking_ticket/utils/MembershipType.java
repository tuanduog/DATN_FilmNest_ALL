package com.booking.booking_ticket.utils;

public enum MembershipType {

    PREMIUM("premium"), GOLD("gold"), SILVER("silver");

    private final String value;

    MembershipType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
