package com.smartlife.dto;

import com.smartlife.model.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class TaskDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "User ID is required")
        private String userId;

        @NotBlank(message = "Title is required")
        private String title;

        private String description;

        @NotNull(message = "Category is required")
        private Task.Category category;

        private LocalDateTime dueDate;
    }

    @Data
    public static class UpdateRequest {
        private String title;
        private String description;
        private Task.Category category;
        private LocalDateTime dueDate;
        private Task.Status status;
    }

    @Data
    public static class TaskResponse {
        private String id;
        private String userId;
        private String title;
        private String description;
        private Task.Category category;
        private LocalDateTime dueDate;
        private Task.Status status;
        private int priorityScore;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private boolean overdue;

        public static TaskResponse from(Task task) {
            TaskResponse resp = new TaskResponse();
            resp.setId(task.getId());
            resp.setUserId(task.getUserId());
            resp.setTitle(task.getTitle());
            resp.setDescription(task.getDescription());
            resp.setCategory(task.getCategory());
            resp.setDueDate(task.getDueDate());
            resp.setStatus(task.getStatus());
            resp.setPriorityScore(task.getPriorityScore());
            resp.setCreatedAt(task.getCreatedAt());
            resp.setUpdatedAt(task.getUpdatedAt());
            resp.setOverdue(
                task.getDueDate() != null
                && task.getDueDate().isBefore(LocalDateTime.now())
                && task.getStatus() == Task.Status.PENDING
            );
            return resp;
        }
    }
}
