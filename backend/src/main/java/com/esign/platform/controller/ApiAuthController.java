package com.esign.platform.controller;

import com.esign.platform.dto.AuthResponse;
import com.esign.platform.dto.EmailOtpDto;
import com.esign.platform.dto.LoginRequest;
import com.esign.platform.dto.RegisterRequest;
import com.esign.platform.model.User;
import com.esign.platform.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApiAuthController {

    private final AuthService authService;

    @Value("${app.security.expose-test-otp:true}")
    private boolean exposeTestOtp;

    @PostMapping("/send-registration-otp")
    public ResponseEntity<?> sendRegistrationOtp(@Valid @RequestBody EmailOtpDto dto) {
        try {
            String otp = authService.sendRegistrationOtp(dto.getEmail());
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "A 6-digit verification code has been dispatched to your email address.");
            if (exposeTestOtp) {
                resp.put("testOtp", otp);
            }
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/verify-registration-otp")
    public ResponseEntity<?> verifyRegistrationOtp(@Valid @RequestBody EmailOtpDto dto) {
        try {
            authService.verifyRegistrationOtp(dto.getEmail(), dto.getOtpCode());
            return ResponseEntity.ok(Map.of("success", true, "message", "Email verified successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.registerUser(request);
        // Automatically authenticate and issue token after registration
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(request.getEmail());
        loginRequest.setPassword(request.getPassword());
        return ResponseEntity.ok(authService.authenticate(loginRequest));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        return authService.getCurrentUser()
                .map(u -> ResponseEntity.ok(Map.of(
                        "id", u.getId(),
                        "email", u.getEmail(),
                        "firstName", u.getFirstName(),
                        "lastName", u.getLastName(),
                        "fullName", u.getFullName(),
                        "role", u.getRole().name(),
                        "organization", u.getOrganization() != null ? u.getOrganization().getName() : "Enterprise"
                )))
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Unauthorized")));
    }
}

