package com.esign.platform.controller;

import com.esign.platform.model.Document;
import com.esign.platform.model.User;
import com.esign.platform.repository.AuditLogRepository;
import com.esign.platform.repository.DocumentRepository;
import com.esign.platform.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final AuthService authService;
    private final DocumentRepository documentRepository;
    private final AuditLogRepository auditLogRepository;

    @GetMapping(value = {"/", "/index.html"})
    public String index() {
        return "index";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "redirect:/#/dashboard";
    }

    @GetMapping("/profile")
    public String profile() {
        return "redirect:/#/profile";
    }
}

