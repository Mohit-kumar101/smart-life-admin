package com.smartlife.repository;

import com.smartlife.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {

    List<Task> findByUserIdOrderByPriorityScoreDesc(String userId);

    List<Task> findByUserIdAndStatus(String userId, Task.Status status);

    long countByUserId(String userId);

    long countByUserIdAndStatus(String userId, Task.Status status);

    /**
     * Find overdue pending tasks: due before now and still pending.
     */
    @Query("{ 'userId': ?0, 'status': 'PENDING', 'dueDate': { $lt: ?1 } }")
    List<Task> findOverdueTasks(String userId, LocalDateTime now);

    long countByUserIdAndStatusAndDueDateBefore(String userId, Task.Status status, LocalDateTime dateTime);

    List<Task> findByUserIdAndCategory(String userId, Task.Category category);
}
