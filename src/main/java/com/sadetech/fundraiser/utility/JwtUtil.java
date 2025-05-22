package com.sadetech.fundraiser.utility;

import com.sadetech.fundraiser.exception.InvalidTokenException;
import com.sadetech.fundraiser.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private final SecretKey key ;
    private static final long EXPIRATION_TIME = 86_400_000;
    private static final long REFRESH_TOKEN_EXPIRATION_TIME = 604_800_000;

    public JwtUtil(@Value("${jwt.secret}") String secretKey) {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey.getBytes(StandardCharsets.UTF_8));
        this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .issuer("SadeTech-Fundraiser")
                .claim("role", user.getRole())
                .claim("userId", user.getId())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(User userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuer("SadeTech-Fundraiser")
                .claim("role", userDetails.getRole())
                .claim("userId", userDetails.getId())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        return claimsTFunction.apply(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }

    public String extractUserId(String token) {
        if (isTokenExpired(token)) {
            throw new InvalidTokenException("Token is expired.");
        }
        return extractClaims(token, claims -> claims.get("userId")).toString();
    }

    public List<String> extractRole(String token) {
        if (isTokenExpired(token)) {
            throw new InvalidTokenException("Token is expired.");
        }

        return extractClaims(token, claims -> {
            Object roles = claims.get("role");
            if (roles instanceof List<?>) {
                return ((List<?>) roles).stream()
                        .map(Object::toString)
                        .collect(Collectors.toList());
            } else {
                return List.of(roles.toString()); // fallback if it's a single role as a string
            }
        });
    }

}
