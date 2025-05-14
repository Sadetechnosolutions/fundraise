package com.sadetech.fundraiser.service;

import com.sadetech.fundraiser.exception.RedisConnectionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimiterService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final int LIMIT = 5;              // max 5 requests
    private static final long DURATION = 60;         // in seconds (1 minute)

    public boolean isAllowed(String userKey) {
        String key = "rate_limiter:" + userKey;

        // Increment the counter for this user/IP
        Long count = redisTemplate.opsForValue().increment(key);

        if (count == null) {
            throw new RedisConnectionException("Error connecting to Redis. Possible network issue or Redis is down.");
        }

        // If it's the first request, set expiry on the key
        if (count == 1) {
            redisTemplate.expire(key, Duration.ofSeconds(DURATION));
        }

        // Allow request if the count is <= LIMIT
        return count <= LIMIT;
    }
}