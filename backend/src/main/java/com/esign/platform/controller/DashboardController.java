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

    @GetMapping("/")
    public String index(Model model) {
        Optional<User> currentUser = authService.getCurrentUser();
        if (currentUser.isPresent()) {
            return "redirect:/dashboard";
        }
        return "index";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));

        long totalDocs = documentRepository.countByUploadedBy(user);
        long pendingDocs = documentRepository.countByUploadedByAndStatus(user, Document.Status.SENT)
                + documentRepository.countByUploadedByAndStatus(user, Document.Status.IN_PROGRESS);
        long completedDocs = documentRepository.countByUploadedByAndStatus(user, Document.Status.COMPLETED);
        long draftDocs = documentRepository.countByUploadedByAndStatus(user, Document.Status.DRAFT);

        model.addAttribute("user", user);
        model.addAttribute("totalDocs", totalDocs);
        model.addAttribute("pendingDocs", pendingDocs);
        model.addAttribute("completedDocs", completedDocs);
        model.addAttribute("draftDocs", draftDocs);

        model.addAttribute("recentDocuments", documentRepository.findTop5ByUploadedByOrderByCreatedAtDesc(user));
        model.addAttribute("recentActivity", auditLogRepository.findTop15ByOrderByTimestampDesc());

        return "dashboard";
    }
}

