package com.esign.platform.controller;

import com.esign.platform.model.AuditLog;
import com.esign.platform.model.Document;
import com.esign.platform.model.User;
import com.esign.platform.repository.AuditLogRepository;
import com.esign.platform.repository.DocumentRepository;
import com.esign.platform.repository.UserRepository;
import com.esign.platform.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.UUID;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuthService authService;

    @GetMapping("/users")
    public String listUsers(Model model) {
        User user = authService.getCurrentUser().orElseThrow();
        model.addAttribute("user", user);
        model.addAttribute("usersList", userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
        return "admin/users";
    }

    @PostMapping("/users/{id}/toggle-status")
    public String toggleUserStatus(@PathVariable("id") UUID id, RedirectAttributes redirectAttributes) {
        User target = userRepository.findById(id).orElseThrow();
        target.setEnabled(!target.getEnabled());
        userRepository.save(target);
        redirectAttributes.addFlashAttribute("successMessage",
                "User " + target.getEmail() + " status updated to " + (target.getEnabled() ? "Active" : "Disabled"));
        return "redirect:/admin/users";
    }

    @GetMapping("/audit-logs")
    public String viewAuditLogs(@RequestParam(value = "page", defaultValue = "0") int page,
                                @RequestParam(value = "size", defaultValue = "25") int size,
                                Model model) {
        User user = authService.getCurrentUser().orElseThrow();
        Page<AuditLog> auditLogs = auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size));

        model.addAttribute("user", user);
        model.addAttribute("auditLogs", auditLogs);
        return "admin/audit-logs";
    }

    @GetMapping("/documents")
    public String listAllDocuments(@RequestParam(value = "page", defaultValue = "0") int page,
                                   @RequestParam(value = "size", defaultValue = "15") int size,
                                   Model model) {
        User user = authService.getCurrentUser().orElseThrow();
        Page<Document> docs = documentRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        model.addAttribute("user", user);
        model.addAttribute("documents", docs);
        return "admin/documents";
    }
}

