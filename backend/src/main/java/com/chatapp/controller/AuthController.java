package com.chatapp.controller;

import com.chatapp.model.LoginRequest;
import com.chatapp.model.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // Fake token: just base64-encode the username + a fixed suffix.
        // Replace with real JWT issuance if you add real auth later.
        String fakeToken = Base64.getEncoder()
                .encodeToString((request.getUsername() + ":dummy-session").getBytes());

        return ResponseEntity.ok(new LoginResponse(request.getUsername(), fakeToken));
    }
}
