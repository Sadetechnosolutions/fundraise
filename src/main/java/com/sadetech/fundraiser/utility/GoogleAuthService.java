package com.sadetech.fundraiser.utility;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class GoogleAuthService {

    @Value("${google.client-id}")
    private String GOOGLE_CLIENT_ID;

    public String verifyGoogleToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken googleIdToken = verifier.verify(idToken);

            if (googleIdToken == null) {
                throw new IllegalArgumentException("Invalid ID Token");
            }

            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            if (payload.getEmailVerified() == null || !payload.getEmailVerified()) {
                throw new IllegalArgumentException("Email not verified by Google");
            }

            return payload.getEmail(); // ✅ Extract email from a token

        } catch (Exception e) {
            throw new IllegalArgumentException("Google ID Token verification failed: " + e.getMessage());
        }
    }
}