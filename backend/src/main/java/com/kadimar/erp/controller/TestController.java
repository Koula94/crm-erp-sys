package com.kadimar.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class TestController {
    
    @Autowired
    private DataSource dataSource;
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "KADIMAR ERP Backend is running successfully");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> databaseCheck() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Connection connection = dataSource.getConnection();
            boolean isValid = connection.isValid(5);
            connection.close();
            
            response.put("database", "PostgreSQL");
            response.put("status", isValid ? "CONNECTED" : "DISCONNECTED");
            response.put("timestamp", LocalDateTime.now());
            
            if (isValid) {
                response.put("message", "Database connection is healthy");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Database connection failed");
                return ResponseEntity.status(503).body(response);
            }
            
        } catch (Exception e) {
            response.put("database", "PostgreSQL");
            response.put("status", "ERROR");
            response.put("timestamp", LocalDateTime.now());
            response.put("message", "Database connection error: " + e.getMessage());
            return ResponseEntity.status(503).body(response);
        }
    }
    
    @GetMapping("/cors")
    public ResponseEntity<Map<String, Object>> corsCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("cors", "ENABLED");
        response.put("allowedOrigins", new String[]{"http://localhost:3000", "http://localhost:3001"});
        response.put("allowedMethods", new String[]{"GET", "POST", "PUT", "DELETE", "OPTIONS"});
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "CORS is properly configured");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/echo")
    public ResponseEntity<Map<String, Object>> echoTest(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();
        response.put("received", payload);
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Echo test successful - POST request received");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "KADIMAR ERP System");
        response.put("description", "Construction Management System Backend");
        response.put("version", "1.0.0");
        response.put("framework", "Spring Boot");
        response.put("database", "PostgreSQL");
        response.put("timestamp", LocalDateTime.now());
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("contacts", "/api/contacts");
        endpoints.put("communications", "/api/communications");
        endpoints.put("health", "/api/test/health");
        endpoints.put("database", "/api/test/database");
        endpoints.put("cors", "/api/test/cors");
        
        response.put("availableEndpoints", endpoints);
        
        return ResponseEntity.ok(response);
    }
}