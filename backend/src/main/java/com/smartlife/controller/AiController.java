package com.smartlife.controller;

import com.smartlife.dto.AiDto;
import com.smartlife.service.AiAssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/suggest")
    public ResponseEntity<AiDto.SuggestResponse> suggest(@Valid @RequestBody AiDto.SuggestRequest request) {
        return ResponseEntity.ok(aiAssistantService.suggest(request));
    }
}
