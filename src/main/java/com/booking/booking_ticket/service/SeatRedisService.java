package com.booking.booking_ticket.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class SeatRedisService {

    private final StringRedisTemplate redis;

    public SeatRedisService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    private String keyFor(Integer showTimeId, String date) {
        return "SELECTING_SEATS:" + showTimeId + ":" + date;
    }

    // Add seats for user -> store value as userId:comma-separated-seats? or use per-user key
    public void addSeats(Integer showTimeId, String date, Integer userId, Set<String> seats) {
        String key = keyFor(showTimeId, date);
        // store: member -> JSON "userId:seat1,seat2" OR add seats to a hash field per user
        redis.opsForHash().put(key, userId.toString(), String.join(",", seats));
        // Optional: set TTL
        redis.expire(key, java.time.Duration.ofMinutes(10));
    }

    public void removeUser(Integer showTimeId, String date, Integer userId) {
        String key = keyFor(showTimeId, date);
        redis.opsForHash().delete(key, userId.toString());
    }

    public void removeSeat(Integer showTimeId, String date, Integer userId, String seat) {
        String key = keyFor(showTimeId, date);
        Object val = redis.opsForHash().get(key, userId.toString());
        if (val != null) {
            String s = val.toString();
            String[] arr = s.split(",");
            StringBuilder sb = new StringBuilder();
            for (String a : arr) {
                if (!a.equals(seat) && !a.isBlank()) {
                    if (sb.length() > 0) sb.append(",");
                    sb.append(a);
                }
            }
            if (sb.length() == 0) {
                redis.opsForHash().delete(key, userId.toString());
            } else {
                redis.opsForHash().put(key, userId.toString(), sb.toString());
            }
        }
    }

    // Get all selected seats (map userId -> seats CSV)
    public java.util.Map<Object, Object> getAll(Integer showTimeId, String date) {
        String key = keyFor(showTimeId, date);
        return redis.opsForHash().entries(key);
    }
}
