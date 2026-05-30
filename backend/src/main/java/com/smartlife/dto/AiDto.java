package com.smartlife.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AiDto {

    @Data
    public static class SuggestRequest {
        @NotBlank(message = "User ID is required")
        private String userId;

        @NotBlank(message = "Question is required")
        private String question;
    }

    @Data
    public static class SuggestResponse {
        private String answer;
        private String model;
        private boolean aiPowered;

        public static SuggestResponse mock(String answer) {
            SuggestResponse resp = new SuggestResponse();
            resp.setAnswer(answer);
            resp.setModel("smart-mock-v1");
            resp.setAiPowered(false);
            return resp;
        }

        public static SuggestResponse ai(String answer) {
            SuggestResponse resp = new SuggestResponse();
            resp.setAnswer(answer);
            resp.setModel("gpt-4o-mini");
            resp.setAiPowered(true);
            return resp;
        }
    }
}
