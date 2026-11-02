package com.esign.platform.controller;

import com.esign.platform.dto.DocumentVerificationResultDto;
import com.esign.platform.service.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequiredArgsConstructor
@Slf4j
public class VerificationController {

    private final VerificationService verificationService;

    @GetMapping("/verify")
    public String verifyPage(@RequestParam(value = "hash", required = false) String hash,
                             Model model) {
        if (hash != null && !hash.isBlank()) {
            DocumentVerificationResultDto result = verificationService.verifyByHash(hash);
            model.addAttribute("result", result);
            model.addAttribute("searchedHash", hash);
        }
        return "verify";
    }

    @PostMapping("/verify")
    public String verifyHashPost(@RequestParam("hash") String hash, Model model) {
        DocumentVerificationResultDto result = verificationService.verifyByHash(hash);
        model.addAttribute("result", result);
        model.addAttribute("searchedHash", hash);
        return "verify";
    }

    @PostMapping("/verify/upload")
    public String verifyFileUpload(@RequestParam("file") MultipartFile file, Model model) {
        if (file.isEmpty()) {
            model.addAttribute("errorMessage", "Please select a PDF file to verify.");
            return "verify";
        }
        DocumentVerificationResultDto result = verificationService.verifyUploadedFile(file);
        model.addAttribute("result", result);
        model.addAttribute("searchedHash", result.getFinalHash() != null ? result.getFinalHash() : result.getOriginalHash());
        return "verify";
    }

    // Public REST API endpoint for legal / auditor automated verification
    @GetMapping("/api/v1/verify/{hash}")
    @ResponseBody
    public ResponseEntity<DocumentVerificationResultDto> apiVerify(@PathVariable("hash") String hash) {
        return ResponseEntity.ok(verificationService.verifyByHash(hash));
    }
}

