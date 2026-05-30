package com.smartlife.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AnalyticsDto {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;

    /**
     * Workload score 0-100.
     * Based on pending + overdue task count and urgency distribution.
     */
    private int workloadScore;

    /**
     * Suggested number of tasks to tackle today.
     */
    private int dailySuggestedTasks;

    /**
     * Category breakdown for charting.
     */
    private CategoryBreakdown categoryBreakdown;

    /**
     * Completion rate as percentage.
     */
    private double completionRate;

    @Data
    @Builder
    public static class CategoryBreakdown {
        private long urgent;
        private long important;
        private long normal;
        private long optional;
    }
}
