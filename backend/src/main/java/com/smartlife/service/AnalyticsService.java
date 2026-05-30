package com.smartlife.service;

import com.smartlife.dto.AnalyticsDto;
import com.smartlife.exception.AppException;
import com.smartlife.model.Task;
import com.smartlife.repository.TaskRepository;
import com.smartlife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public AnalyticsDto getAnalytics(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException("User not found: " + userId);
        }

        long total = taskRepository.countByUserId(userId);
        long completed = taskRepository.countByUserIdAndStatus(userId, Task.Status.DONE);
        long pending = taskRepository.countByUserIdAndStatus(userId, Task.Status.PENDING);
        long overdue = taskRepository.countByUserIdAndStatusAndDueDateBefore(
                userId, Task.Status.PENDING, LocalDateTime.now());

        // Category breakdown
        long urgentCount = taskRepository.findByUserIdAndCategory(userId, Task.Category.URGENT).size();
        long importantCount = taskRepository.findByUserIdAndCategory(userId, Task.Category.IMPORTANT).size();
        long normalCount = taskRepository.findByUserIdAndCategory(userId, Task.Category.NORMAL).size();
        long optionalCount = taskRepository.findByUserIdAndCategory(userId, Task.Category.OPTIONAL).size();

        int workloadScore = calculateWorkloadScore(pending, overdue, urgentCount);
        int dailySuggested = calculateDailySuggested(pending, workloadScore);
        double completionRate = total > 0 ? (double) completed / total * 100 : 0;

        return AnalyticsDto.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .pendingTasks(pending)
                .overdueTasks(overdue)
                .workloadScore(workloadScore)
                .dailySuggestedTasks(dailySuggested)
                .completionRate(Math.round(completionRate * 10.0) / 10.0)
                .categoryBreakdown(AnalyticsDto.CategoryBreakdown.builder()
                        .urgent(urgentCount)
                        .important(importantCount)
                        .normal(normalCount)
                        .optional(optionalCount)
                        .build())
                .build();
    }

    /**
     * Workload score (0–100):
     * - overdue tasks weighted 3x
     * - urgent pending tasks weighted 2x
     * - normal pending tasks weighted 1x
     * Capped at 100.
     */
    private int calculateWorkloadScore(long pending, long overdue, long urgentCount) {
        if (pending == 0 && overdue == 0) return 0;

        double rawScore = (overdue * 3.0) + (urgentCount * 2.0) + (pending * 1.0);
        // Normalize: assume 20 tasks with overdue mix = 100% load
        double normalized = (rawScore / 60.0) * 100;
        return (int) Math.min(100, Math.max(0, normalized));
    }

    /**
     * Suggest how many tasks to do today based on workload.
     * High workload → suggest fewer, focused tasks.
     * Low workload → suggest more.
     */
    private int calculateDailySuggested(long pending, int workloadScore) {
        if (pending == 0) return 0;
        if (workloadScore > 75) return 3;
        if (workloadScore > 50) return 5;
        if (workloadScore > 25) return 7;
        return (int) Math.min(pending, 10);
    }
}
