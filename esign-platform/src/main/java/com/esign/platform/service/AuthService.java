package com.esign.platform.service;

import com.esign.platform.dto.AuthResponse;
import com.esign.platform.dto.LoginRequest;
import com.esign.platform.dto.RegisterRequest;
import com.esign.platform.model.Organization;
import com.esign.platform.model.User;
import com.esign.platform.repository.OrganizationRepository;
import com.esign.platform.repository.UserRepository;
import com.esign.platform.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists: " + request.getEmail());
        }

        // Create or assign organization
        String orgName = (request.getOrganizationName() != null && !request.getOrganizationName().isBlank())
                ? request.getOrganizationName()
                : (request.getFirstName() + "'s Organization");

        Organization organization = Organization.builder()
                .name(orgName)
                .plan("PRO")
                .build();
        Organization savedOrg = organizationRepository.save(organization);

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .organization(savedOrg)
                .role(User.Role.SIGNER)
                .enabled(true)
                .build();

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

