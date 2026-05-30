package com.smartlife.service;

import com.smartlife.dto.TaskDto;
import com.smartlife.exception.AppException;
import com.smartlife.model.Task;
import com.smartlife.repository.TaskRepository;
import com.smartlife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskPriorityService priorityService;

    public TaskDto.TaskResponse createTask(TaskDto.CreateRequest request) {
        // Validate user exists
        if (!userRepository.existsById(request.getUserId())) {
            throw new AppException(
                    "User not found. Please log out and sign in again.",
                    HttpStatus.NOT_FOUND.value()
            );
        }

        Task task = Task.builder()
                .userId(request.getUserId())
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .category(request.getCategory())
                .dueDate(request.getDueDate())
                .status(Task.Status.PENDING)
                .priorityScore(0)
                .build();

        // Calculate priority before saving
        priorityService.applyScore(task);

        Task saved = taskRepository.save(task);
        log.info("Task created: {} for user: {}", saved.getId(), saved.getUserId());
        return TaskDto.TaskResponse.from(saved);
    }

    public List<TaskDto.TaskResponse> getTasksByUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException("User not found: " + userId);
        }

        List<Task> tasks = taskRepository.findByUserIdOrderByPriorityScoreDesc(userId);

        // Recalculate priority scores on fetch and bulk-save if changed
        tasks.forEach(priorityService::applyScore);
        taskRepository.saveAll(tasks);

        return tasks.stream()
                .map(TaskDto.TaskResponse::from)
                .collect(Collectors.toList());
    }

    public TaskDto.TaskResponse updateTask(String taskId, TaskDto.UpdateRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new AppException("Task not found: " + taskId));

        if (request.getTitle() != null) task.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getCategory() != null) task.setCategory(request.getCategory());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getStatus() != null) task.setStatus(request.getStatus());

        priorityService.applyScore(task);

        Task updated = taskRepository.save(task);
        log.info("Task updated: {}", taskId);
        return TaskDto.TaskResponse.from(updated);
    }

    public void deleteTask(String taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new AppException("Task not found: " + taskId);
        }
        taskRepository.deleteById(taskId);
        log.info("Task deleted: {}", taskId);
    }

    public TaskDto.TaskResponse completeTask(String taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new AppException("Task not found: " + taskId));

        task.setStatus(Task.Status.DONE);
        priorityService.applyScore(task); // Score becomes 0 for completed

        Task updated = taskRepository.save(task);
        log.info("Task completed: {}", taskId);
        return TaskDto.TaskResponse.from(updated);
    }
}
