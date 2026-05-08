package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.service.SeatRedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class SeatRedisServiceImpl implements SeatRedisService {

    @Autowired
    private StringRedisTemplate redis;

    @Override
    public String keyFor(Integer showTimeId, String date) {
        return "SELECTING_SEATS:" + showTimeId + ":" + date;
    }

    @Override
    public void addSeats(Integer showTimeId, String date, Integer userId, Set<String> seats) {
        String key = keyFor(showTimeId, date);

        redis.opsForHash().put(key, userId.toString(), String.join(",", seats));
        redis.expire(key, java.time.Duration.ofMinutes(10));
    }

    @Override
    public void removeUser(Integer showTimeId, String date, Integer userId) {
        String key = keyFor(showTimeId, date);
        redis.opsForHash().delete(key, userId.toString());
    }

    @Override
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

    @Override
    public Map<Object, Object> getAll(Integer showTimeId, String date) {
        String key = keyFor(showTimeId, date);
        return redis.opsForHash().entries(key);
    }
}
