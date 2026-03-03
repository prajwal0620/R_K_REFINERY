package com.rkrefinery.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    // Hum ek simple "JWT-style" token banayenge:
    // header.payload.signature
    // header = constant JSON string (base64url)
    // payload = "username|expiryTimestampMillis" (base64url)
    // signature = HMAC-SHA256(header + "." + payload, secret)

    private static final String HEADER_JSON = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";

    // ============ PUBLIC METHODS (filter / controller use karte hain) ============

    public String generateToken(UserDetails userDetails) {
        try {
            long nowMillis = System.currentTimeMillis();
            long expMillis = nowMillis + jwtExpirationMs;

            String headerPart = base64UrlEncode(HEADER_JSON.getBytes(StandardCharsets.UTF_8));

            // payload format: "username|expMillis"
            String payloadStr = userDetails.getUsername() + "|" + expMillis;
            String payloadPart = base64UrlEncode(payloadStr.getBytes(StandardCharsets.UTF_8));

            String data = headerPart + "." + payloadPart;
            String signaturePart = base64UrlEncode(hmacSha256(data));

            return data + "." + signaturePart;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate token", e);
        }
    }

    public String extractUsername(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;

            String payloadStr = new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8);
            int sepIndex = payloadStr.indexOf('|');
            if (sepIndex < 0) return null;

            return payloadStr.substring(0, sepIndex);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            if (username == null || !username.equals(userDetails.getUsername())) {
                return false;
            }
            if (isTokenExpired(token)) {
                return false;
            }
            if (!isSignatureValid(token)) {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ================== INTERNAL HELPERS ==================

    private boolean isTokenExpired(String token) {
        long expMillis = extractExpirationMillis(token);
        return expMillis == 0L || expMillis < System.currentTimeMillis();
    }

    private long extractExpirationMillis(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return 0L;

            String payloadStr = new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8);
            int sepIndex = payloadStr.indexOf('|');
            if (sepIndex < 0) return 0L;

            String expStr = payloadStr.substring(sepIndex + 1);
            return Long.parseLong(expStr);
        } catch (Exception e) {
            return 0L;
        }
    }

    private boolean isSignatureValid(String token) throws Exception {
        String[] parts = token.split("\\.");
        if (parts.length != 3) return false;

        String data = parts[0] + "." + parts[1];
        String expectedSignature = base64UrlEncode(hmacSha256(data));

        return expectedSignature.equals(parts[2]);
    }

    private byte[] hmacSha256(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(keySpec);
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }

    private String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private byte[] base64UrlDecode(String str) {
        return Base64.getUrlDecoder().decode(str);
    }
}