package com.booking.booking_ticket.utils;

public enum RoomType {

    TWOD("2d"), THREED("3d"), IMAX("imax");

    private final String value;

    RoomType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
