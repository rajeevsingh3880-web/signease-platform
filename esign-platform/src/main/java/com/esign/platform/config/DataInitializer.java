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

        // 2a. Master Admin (Super Admin with root system privileges)
        if (!userRepository.existsByEmail("masteradmin@esign.com")) {
            User master = User.builder()
                    .organization(org)
                    .firstName("Master")
                    .lastName("Administrator")
                    .email("masteradmin@esign.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+91 99000 11111")
                    .role(User.Role.MASTER_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(master);
            log.info("Created Master Admin user: masteradmin@esign.com / admin123");
        }

        // 2b. Company Admin (Enterprise Tenant Administrator e.g. Aadvik FinTech)
        if (!userRepository.existsByEmail("companyadmin@esign.com")) {
            User compAdmin = User.builder()
                    .organization(org)
                    .firstName("Company")
                    .lastName("Admin")
                    .email("companyadmin@esign.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+91 99000 22222")
                    .role(User.Role.COMPANY_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(compAdmin);
            log.info("Created Company Admin user: companyadmin@esign.com / admin123");
        }

        // 2c. Customer Admin (Account / Operations Manager)
        if (!userRepository.existsByEmail("customeradmin@esign.com")) {
            User custAdmin = User.builder()
                    .organization(org)
                    .firstName("Customer")
                    .lastName("Admin")
                    .email("customeradmin@esign.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+91 99000 33333")
                    .role(User.Role.CUSTOMER_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(custAdmin);
            log.info("Created Customer Admin user: customeradmin@esign.com / admin123");
        }

        // 2d. Client Admin / Client Signer
        if (!userRepository.existsByEmail("client@esign.com")) {
            User client = User.builder()
                    .organization(org)
                    .firstName("Client")
                    .lastName("Account")
                    .email("client@esign.com")
                    .password(passwordEncoder.encode("password123"))
                    .phone("+91 99000 44444")
                    .role(User.Role.CLIENT)
                    .enabled(true)
                    .build();
            userRepository.save(client);
            log.info("Created Client user: client@esign.com / password123");
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

