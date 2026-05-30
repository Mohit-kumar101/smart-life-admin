package com.smartlife.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String title;

    private String description;

    private Category category;

    @Indexed
    private LocalDateTime dueDate;

    private Status status;

    /**
     * Calculated priority score (0-100).
     * Higher = more urgent/important.
     * Recalculated on fetch/update.
     */
    private int priorityScore;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Category {
        URGENT,
        IMPORTANT,
        NORMAL,
        OPTIONAL
    }

    public enum Status {
        PENDING,
        DONE
    }
}
