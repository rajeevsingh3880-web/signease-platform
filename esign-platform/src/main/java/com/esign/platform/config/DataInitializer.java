package com.esign.platform.config;

import com.esign.platform.model.Document;
import com.esign.platform.model.Organization;
import com.esign.platform.model.User;
import com.esign.platform.repository.DocumentRepository;
import com.esign.platform.repository.OrganizationRepository;
import com.esign.platform.repository.UserRepository;
import com.esign.platform.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Checking and initializing default E-Sign Platform seed data...");

        // 1. Ensure default Organization exists
        Organization org = organizationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name("SignEase Digital Solutions")
                    .plan("ENTERPRISE")
                    .build();
            return organizationRepository.save(newOrg);
        });

        // 2. Ensure default Admin user exists
        if (!userRepository.existsByEmail("admin@esign.com")) {
            User admin = User.builder()
                    .organization(org)
                    .firstName("System")
                    .lastName("Administrator")
                    .email("admin@esign.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+91 98765 43210")
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Created default Admin user: admin@esign.com / admin123");
        }

        // 3. Ensure demo sender user exists
        if (!userRepository.existsByEmail("demo@esign.com")) {
            User demo = User.builder()
                    .organization(org)
                    .firstName("Rajesh")
                    .lastName("Sharma")
                    .email("demo@esign.com")
                    .password(passwordEncoder.encode("password123"))
                    .phone("+91 98234 56789")
                    .role(User.Role.SIGNER)
                    .enabled(true)
                    .build();
            userRepository.save(demo);
            log.info("Created default Demo user: demo@esign.com / password123");
        }

        log.info("E-Sign Platform initialization complete. Ready for requests!");
    }
}

