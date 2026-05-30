package com.smartlife.controller;

import com.smartlife.dto.AnalyticsDto;
import com.smartlife.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/{userId}")
    public ResponseEntity<AnalyticsDto> getAnalytics(@PathVariable String userId) {
        return ResponseEntity.ok(analyticsService.getAnalytics(userId));
    }
}
