package com.smartlife.controller;

import com.smartlife.dto.TaskDto;
import com.smartlife.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskDto.TaskResponse> createTask(@Valid @RequestBody TaskDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<TaskDto.TaskResponse>> getTasksByUser(@PathVariable String userId) {
        return ResponseEntity.ok(taskService.getTasksByUser(userId));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskDto.TaskResponse> updateTask(
            @PathVariable String taskId,
            @RequestBody TaskDto.UpdateRequest request) {
        return ResponseEntity.ok(taskService.updateTask(taskId, request));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable String taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }

    @PatchMapping("/complete/{taskId}")
    public ResponseEntity<TaskDto.TaskResponse> completeTask(@PathVariable String taskId) {
        return ResponseEntity.ok(taskService.completeTask(taskId));
    }
}
