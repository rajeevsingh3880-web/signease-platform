package com.esign.platform.controller;

import com.esign.platform.dto.AuthResponse;
import com.esign.platform.dto.LoginRequest;
import com.esign.platform.dto.RegisterRequest;
import com.esign.platform.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
                            @RequestParam(value = "logout", required = false) String logout,
                            Model model) {
        if (error != null) {
            model.addAttribute("errorMessage", "Invalid email or password. Please try again.");
        }
        if (logout != null) {
            model.addAttribute("successMessage", "You have been successfully signed out.");
        }
        return "login";
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        if (!model.containsAttribute("registerRequest")) {
            model.addAttribute("registerRequest", new RegisterRequest());
        }
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("registerRequest") RegisterRequest request,
                               BindingResult result,
                               RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "register";
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            result.rejectValue("confirmPassword", "error.mismatch", "Passwords do not match");
            return "register";
        }

        try {
            authService.registerUser(request);
            redirectAttributes.addFlashAttribute("successMessage", "Account created successfully! Please log in.");
            return "redirect:/login";
        } catch (IllegalArgumentException e) {
            result.rejectValue("email", "error.duplicate", e.getMessage());
            return "register";
        }
    }

    // REST API Auth endpoints
    @PostMapping("/api/auth/login")
    @ResponseBody
    public ResponseEntity<AuthResponse> apiLogin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/api/auth/register")
    @ResponseBody
    public ResponseEntity<?> apiRegister(@Valid @RequestBody RegisterRequest request) {
        authService.registerUser(request);
        return ResponseEntity.ok().body("{\"message\": \"User registered successfully\"}");
    }
}

