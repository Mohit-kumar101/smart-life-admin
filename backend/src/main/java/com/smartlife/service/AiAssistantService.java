package com.smartlife.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlife.dto.AiDto;
import com.smartlife.dto.TaskDto;
import com.smartlife.exception.AppException;
import com.smartlife.model.Task;
import com.smartlife.repository.TaskRepository;
import com.smartlife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskPriorityService priorityService;

    @Value("${app.ai.api-key:mock}")
    private String apiKey;

    @Value("${app.ai.enabled:false}")
    private boolean aiEnabled;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiDto.SuggestResponse suggest(AiDto.SuggestRequest request) {
        if (!userRepository.existsById(request.getUserId())) {
            throw new AppException("User not found: " + request.getUserId());
        }

        List<Task> tasks = taskRepository.findByUserIdOrderByPriorityScoreDesc(request.getUserId());
        tasks.forEach(priorityService::applyScore);

        String prompt = buildPrompt(tasks, request.getQuestion());

        if (aiEnabled && !"mock".equals(apiKey)) {
            return callOpenAI(prompt);
        } else {
            return generateMockResponse(tasks, request.getQuestion());
        }
    }

    /**
     * Build a context-aware prompt including task details.
     */
    private String buildPrompt(List<Task> tasks, String question) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a helpful life admin assistant. The user has the following tasks:\n\n");

        if (tasks.isEmpty()) {
            sb.append("(No tasks yet)\n\n");
        } else {
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
            tasks.forEach(t -> {
                sb.append(String.format("- [%s] %s | Category: %s | Priority: %d/100 | Due: %s\n",
                        t.getStatus(),
                        t.getTitle(),
                        t.getCategory(),
                        t.getPriorityScore(),
                        t.getDueDate() != null ? t.getDueDate().format(fmt) : "No deadline"
                ));
            });
        }

        sb.append("\nUser question: ").append(question);
        sb.append("\n\nProvide a practical, concise response focused on helping manage their tasks and time.");
        return sb.toString();
    }

    /**
     * Call OpenAI API if key is configured.
     */
    private AiDto.SuggestResponse callOpenAI(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "model", "gpt-4o-mini",
                    "max_tokens", 500,
                    "messages", List.of(
                            Map.of("role", "user", "content", prompt)
                    )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions", entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                String answer = (String) message.get("content");
                return AiDto.SuggestResponse.ai(answer.trim());
            }
        } catch (Exception e) {
            log.error("OpenAI call failed, falling back to mock: {}", e.getMessage());
        }
        return AiDto.SuggestResponse.mock("AI service unavailable. Please try again later.");
    }

    /**
     * Generate intelligent mock responses based on actual task data.
     */
    private AiDto.SuggestResponse generateMockResponse(List<Task> tasks, String question) {
        long overdue = tasks.stream()
                .filter(t -> t.getStatus() == Task.Status.PENDING
                        && t.getDueDate() != null
                        && t.getDueDate().isBefore(LocalDateTime.now()))
                .count();

        long pending = tasks.stream()
                .filter(t -> t.getStatus() == Task.Status.PENDING)
                .count();

        long completed = tasks.stream()
                .filter(t -> t.getStatus() == Task.Status.DONE)
                .count();

        String questionLower = question.toLowerCase();

        String answer;

        if (questionLower.contains("overdue") || questionLower.contains("late")) {
            answer = overdue == 0
                    ? "Great news! You have no overdue tasks. Keep up the momentum!"
                    : String.format("You have %d overdue task(s). I recommend addressing them immediately — "
                    + "start with the highest priority ones shown in red on your Tasks page.", overdue);

        } else if (questionLower.contains("today") || questionLower.contains("focus") || questionLower.contains("priority")) {
            List<Task> topTasks = tasks.stream()
                    .filter(t -> t.getStatus() == Task.Status.PENDING)
                    .limit(3)
                    .collect(Collectors.toList());
            if (topTasks.isEmpty()) {
                answer = "You have no pending tasks! This is a great time to plan ahead or take a break.";
            } else {
                StringBuilder sb = new StringBuilder("Here are your top priorities for today:\n");
                topTasks.forEach(t -> sb.append(String.format("• %s (Priority: %d/100)\n", t.getTitle(), t.getPriorityScore())));
                sb.append("\nFocus on these first before moving to lower-priority items.");
                answer = sb.toString();
            }

        } else if (questionLower.contains("progress") || questionLower.contains("done") || questionLower.contains("complet")) {
            int rate = tasks.isEmpty() ? 0 : (int) ((double) completed / tasks.size() * 100);
            answer = String.format("You've completed %d out of %d tasks (%d%% completion rate). %s",
                    completed, tasks.size(), rate,
                    rate >= 70 ? "Excellent work! You're crushing it." :
                    rate >= 40 ? "Good progress! Keep the momentum going." :
                    "There's room to improve. Try completing 2-3 tasks today to build momentum.");

        } else if (questionLower.contains("plan") || questionLower.contains("schedule") || questionLower.contains("week")) {
            answer = String.format("Based on your %d pending tasks, here's my suggestion: "
                    + "Tackle overdue items first (%d), then work through urgent tasks. "
                    + "Aim for 3-5 task completions per day to maintain a healthy workload balance. "
                    + "Use the Analytics page to track your workload score.", pending, overdue);

        } else if (questionLower.contains("stress") || questionLower.contains("overwhelm") || questionLower.contains("too much")) {
            answer = pending > 10
                    ? String.format("With %d pending tasks, it's understandable to feel overwhelmed. "
                    + "My advice: pick just ONE urgent task right now and complete it. "
                    + "Small wins build momentum. Consider delegating or postponing OPTIONAL category tasks.", pending)
                    : "Your workload looks manageable! Focus on one task at a time and you'll get through it.";

        } else {
            answer = String.format("You currently have %d total tasks: %d pending and %d completed. "
                    + "Your top priority task is: \"%s\". "
                    + "How can I help you manage your tasks more effectively?",
                    tasks.size(), pending, completed,
                    tasks.stream()
                            .filter(t -> t.getStatus() == Task.Status.PENDING)
                            .findFirst()
                            .map(Task::getTitle)
                            .orElse("No pending tasks")
            );
        }

        return AiDto.SuggestResponse.mock(answer);
    }
}
