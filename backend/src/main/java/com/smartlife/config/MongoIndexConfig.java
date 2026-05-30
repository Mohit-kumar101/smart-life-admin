package com.smartlife.config;

import com.smartlife.model.Task;
import com.smartlife.model.User;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MongoIndexConfig {

    private final MongoTemplate mongoTemplate;

    @PostConstruct
    public void createIndexes() {
        try {
            // Users collection
            mongoTemplate.indexOps(User.class)
                    .ensureIndex(new Index().on("email", Sort.Direction.ASC).unique());

            // Tasks collection
            mongoTemplate.indexOps(Task.class)
                    .ensureIndex(new Index().on("userId", Sort.Direction.ASC));
            mongoTemplate.indexOps(Task.class)
                    .ensureIndex(new Index().on("dueDate", Sort.Direction.ASC));
            mongoTemplate.indexOps(Task.class)
                    .ensureIndex(new Index()
                            .on("userId", Sort.Direction.ASC)
                            .on("status", Sort.Direction.ASC));

            log.info("MongoDB indexes created successfully");
        } catch (Exception e) {
            log.warn("Index creation warning (may already exist): {}", e.getMessage());
        }
    }
}
