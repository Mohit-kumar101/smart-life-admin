package com.smartlife.service;

import com.smartlife.model.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * Smart Priority Engine.
 *
 * Calculates a priority score (0–100) for each task based on:
 * - Overdue status (highest weight)
 * - Days until due date (urgency factor)
 * - Category (URGENT > IMPORTANT > NORMAL > OPTIONAL)
 * - Completed tasks always get 0
 */
@Service
public class TaskPriorityService {

    private static final int MAX_SCORE = 100;

    // Category base scores
    private static final int SCORE_URGENT = 40;
    private static final int SCORE_IMPORTANT = 25;
    private static final int SCORE_NORMAL = 10;
    private static final int SCORE_OPTIONAL = 0;

    // Time-based max additions
    private static final int MAX_OVERDUE_BONUS = 40;
    private static final int MAX_NEARDUE_BONUS = 20;

    /**
     * Calculate and return priority score for a task.
     * Score is NOT persisted here — caller must save if needed.
     */
    public int calculate(Task task) {
        // Completed tasks are deprioritized
        if (task.getStatus() == Task.Status.DONE) {
            return 0;
        }

        int score = getCategoryScore(task.getCategory());
        score += getTimeScore(task.getDueDate());

        return Math.min(score, MAX_SCORE);
    }

    /**
     * Returns category base score contribution.
     */
    private int getCategoryScore(Task.Category category) {
        if (category == null) return SCORE_NORMAL;
        return switch (category) {
            case URGENT -> SCORE_URGENT;
            case IMPORTANT -> SCORE_IMPORTANT;
            case NORMAL -> SCORE_NORMAL;
            case OPTIONAL -> SCORE_OPTIONAL;
        };
    }

    /**
     * Returns time-urgency score contribution.
     *
     * Overdue tasks get maximum time bonus.
     * Tasks due within 1 day get near-maximum.
     * Tasks due in 7+ days get minimal bonus.
     */
    private int getTimeScore(LocalDateTime dueDate) {
        if (dueDate == null) return 0;

        LocalDateTime now = LocalDateTime.now();
        long hoursUntilDue = ChronoUnit.HOURS.between(now, dueDate);

        if (hoursUntilDue < 0) {
            // Overdue: full overdue bonus, scaled by how overdue (capped)
            long hoursOverdue = Math.abs(hoursUntilDue);
            // More overdue = higher score, but capped at MAX_OVERDUE_BONUS
            int overdueBonus = (int) Math.min(MAX_OVERDUE_BONUS, 20 + (hoursOverdue / 24) * 5);
            return overdueBonus;
        } else if (hoursUntilDue <= 24) {
            // Due within 24 hours
            return MAX_NEARDUE_BONUS;
        } else if (hoursUntilDue <= 72) {
            // Due within 3 days
            return 15;
        } else if (hoursUntilDue <= 168) {
            // Due within 7 days
            return 8;
        } else {
            // More than a week away
            return 2;
        }
    }

    /**
     * Recalculate and mutate the task's priorityScore field.
     */
    public void applyScore(Task task) {
        task.setPriorityScore(calculate(task));
    }
}
