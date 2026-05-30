package com.smartlife;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class SmartLifeAdminApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartLifeAdminApplication.class, args);
    }
}
