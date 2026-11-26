package com.esign.platform.service;

import com.esign.platform.dto.AuthResponse;
import com.esign.platform.dto.LoginRequest;
import com.esign.platform.dto.RegisterRequest;
import com.esign.platform.model.Organization;
import com.esign.platform.model.User;
import com.esign.platform.repository.OrganizationRepository;
import com.esign.platform.repository.UserRepository;
import com.esign.platform.security.JwtTokenProvider;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Data
    @AllArgsConstructor
    public static class RegistrationOtpEntry {
        private String otp;
        private LocalDateTime expiry;
        private int attempts;
        private boolean verified;
    }

    private final Map<String, RegistrationOtpEntry> registrationOtpStore = new ConcurrentHashMap<>();

    @Data
    @AllArgsConstructor
    public static class PasswordResetOtpEntry {
        private String otp;
        private LocalDateTime expiry;
        private int attempts;
        private boolean verified;
    }

    private final Map<String, PasswordResetOtpEntry> passwordResetOtpStore = new ConcurrentHashMap<>();

    public String sendForgotPasswordOtp(String email) {
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("A valid email address is required");
        }
        String cleanEmail = email.trim().toLowerCase();

        Optional<User> userOpt = userRepository.findByEmail(cleanEmail);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("No account registered with email: " + cleanEmail);
        }

        LocalDateTime now = LocalDateTime.now();
        PasswordResetOtpEntry existing = passwordResetOtpStore.get(cleanEmail);
        if (existing != null && existing.getExpiry().isAfter(now) && !existing.isVerified()) {
            if (existing.getExpiry().isAfter(now.plusMinutes(9).plusSeconds(15))) {
                log.info("Duplicate password reset OTP request blocked for {} within cooldown. Reusing existing code.", cleanEmail);
                return existing.getOtp();
            }
        }

        int code = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(code);

        passwordResetOtpStore.put(cleanEmail, new PasswordResetOtpEntry(otp, now.plusMinutes(10), 0, false));
        emailService.sendPasswordResetOtpCode(cleanEmail, otp);
        return otp;
    }

    @Transactional
    public void resetPasswordWithOtp(String email, String inputOtp, String newPassword) {
        if (email == null || inputOtp == null || newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("Email, OTP code, and new password are required.");
        }
        String cleanEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("No account found with email: " + cleanEmail));

        PasswordResetOtpEntry entry = passwordResetOtpStore.get(cleanEmail);
        if (entry == null) {
            throw new IllegalArgumentException("No password reset request found for this email. Please request a new OTP.");
        }
        if (entry.getExpiry().isBefore(LocalDateTime.now())) {
            passwordResetOtpStore.remove(cleanEmail);
            throw new IllegalArgumentException("Verification code has expired. Please request a new code.");
        }
        if (entry.getAttempts() >= 5) {
            passwordResetOtpStore.remove(cleanEmail);
            throw new IllegalArgumentException("Maximum verification attempts exceeded. Please request a new code.");
        }

        entry.setAttempts(entry.getAttempts() + 1);

        if (!entry.getOtp().equalsIgnoreCase(inputOtp.trim())) {
            throw new IllegalArgumentException("Invalid verification code. Please check your email and try again.");
        }

        // Successfully verified, update user password
        passwordResetOtpStore.remove(cleanEmail);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password successfully reset for user: {}", cleanEmail);
    }

    public String sendRegistrationOtp(String email) {
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("A valid email address is required");
        }
        String cleanEmail = email.trim().toLowerCase();

        LocalDateTime now = LocalDateTime.now();
        RegistrationOtpEntry existing = registrationOtpStore.get(cleanEmail);
        if (existing != null && existing.getExpiry().isAfter(now) && !existing.isVerified()) {
            if (existing.getExpiry().isAfter(now.plusMinutes(9).plusSeconds(15))) {
                log.info("Duplicate registration OTP request blocked for {} within cooldown. Reusing existing code.", cleanEmail);
                return existing.getOtp();
            }
        }

        int code = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(code);

        registrationOtpStore.put(cleanEmail, new RegistrationOtpEntry(otp, now.plusMinutes(10), 0, false));
        emailService.sendRegistrationOtpCode(cleanEmail, otp);
        return otp;
    }

    public boolean verifyRegistrationOtp(String email, String inputOtp) {
        if (email == null || inputOtp == null) return false;
        String cleanEmail = email.trim().toLowerCase();
        RegistrationOtpEntry entry = registrationOtpStore.get(cleanEmail);

        if (entry == null) {
            throw new IllegalArgumentException("No verification code found for this email. Please request a new OTP.");
        }
        if (entry.getExpiry().isBefore(LocalDateTime.now())) {
            registrationOtpStore.remove(cleanEmail);
            throw new IllegalArgumentException("Verification code has expired. Please request a new code.");
        }
        if (entry.getAttempts() >= 5) {
            registrationOtpStore.remove(cleanEmail);
            throw new IllegalArgumentException("Maximum verification attempts exceeded. Please request a new code.");
        }

        entry.setAttempts(entry.getAttempts() + 1);

        if (!entry.getOtp().equalsIgnoreCase(inputOtp.trim())) {
            throw new IllegalArgumentException("Invalid verification code. Please check your email and try again.");
        }

        entry.setVerified(true);
        return true;
    }

    @Transactional
    public User registerUser(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();

        // Validate email OTP authentication
        RegistrationOtpEntry entry = registrationOtpStore.get(cleanEmail);
        if (request.getOtpCode() == null || request.getOtpCode().isBlank()) {
            throw new IllegalArgumentException("Email verification code (OTP) is required. Please click Get OTP to receive your code.");
        }
        if (entry == null || !entry.getOtp().equalsIgnoreCase(request.getOtpCode().trim()) || entry.getExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Invalid or expired email verification code. Please request a new OTP.");
        }

        // Remove OTP entry once successfully verified
        registrationOtpStore.remove(cleanEmail);

        // Create or assign organization
        String orgName = (request.getOrganizationName() != null && !request.getOrganizationName().isBlank())
                ? request.getOrganizationName()
                : (request.getFirstName() + "'s Organization");

        Organization organization = Organization.builder()
                .name(orgName)
                .plan("PRO")
                .build();
        Organization savedOrg = organizationRepository.save(organization);

        User user = userRepository.findByEmail(cleanEmail)
                .orElseGet(() -> User.builder().email(cleanEmail).role(User.Role.SIGNER).build());

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setOrganization(savedOrg);
        user.setEnabled(true);
        user.setEmailVerified(true);

        return userRepository.save(user);
    }

    public AuthResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("name", user.getFullName());
        claims.put("userId", user.getId().toString());

        String jwt = tokenProvider.generateToken(user.getEmail(), claims);

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public Optional<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return Optional.empty();
        }
        return userRepository.findByEmail(auth.getName());
    }
}

