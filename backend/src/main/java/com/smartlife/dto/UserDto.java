package com.smartlife.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

public class UserDto {

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class UserResponse {
        private String id;
        private String name;
        private String email;
        private LocalDateTime createdAt;

        public static UserResponse from(com.smartlife.model.User user) {
            UserResponse resp = new UserResponse();
            resp.setId(user.getId());
            resp.setName(user.getName());
            resp.setEmail(user.getEmail());
            resp.setCreatedAt(user.getCreatedAt());
            return resp;
        }
    }

    @Data
    public static class AuthResponse {
        private String userId;
        private String name;
        private String email;
        private String message;

        public static AuthResponse from(com.smartlife.model.User user, String message) {
            AuthResponse resp = new AuthResponse();
            resp.setUserId(user.getId());
            resp.setName(user.getName());
            resp.setEmail(user.getEmail());
            resp.setMessage(message);
            return resp;
        }
    }
}
