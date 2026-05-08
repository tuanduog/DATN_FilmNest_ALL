package com.booking.booking_ticket.service;

import java.util.Map;
import java.util.Set;

public interface SeatRedisService {

    public String keyFor(Integer showTimeId, String date);

    public void addSeats(Integer showTimeId, String date, Integer userId, Set<String> seats);

    public void removeUser(Integer showTimeId, String date, Integer userId);

    public void removeSeat(Integer showTimeId, String date, Integer userId, String seat);

    public Map<Object, Object> getAll(Integer showTimeId, String date);
}
