package com.kadimar.erp.controller;

import com.kadimar.erp.model.Communication;
import com.kadimar.erp.model.CommunicationType;
import com.kadimar.erp.service.CommunicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/communications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CommunicationController {
    
    @Autowired
    private CommunicationService communicationService;
    
    @GetMapping
    public ResponseEntity<List<Communication>> getAllCommunications(
            @RequestParam(required = false) String search) {
        
        try {
            List<Communication> communications;
            
            if (search != null && !search.trim().isEmpty()) {
                communications = communicationService.searchCommunications(search);
            } else {
                communications = communicationService.getAllCommunications();
            }
            
            return ResponseEntity.ok(communications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Communication> getCommunicationById(@PathVariable Long id) {
        try {
            Optional<Communication> communication = communicationService.getCommunicationById(id);
            return communication.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<Communication>> getCommunicationsByContactId(
            @PathVariable Long contactId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {
        
        try {
            List<Communication> communications;
            
            if (type != null || search != null) {
                communications = communicationService.getCommunicationsByContactIdAndFilters(contactId, type, search);
            } else {
                communications = communicationService.getCommunicationsByContactId(contactId);
            }
            
            return ResponseEntity.ok(communications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/contact/{contactId}/paginated")
    public ResponseEntity<Page<Communication>> getCommunicationsByContactIdPaginated(
            @PathVariable Long contactId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "communicationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : 
                       Sort.by(sortBy).ascending();
            
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Communication> communications = communicationService.getCommunicationsByContactId(contactId, pageable);
            
            return ResponseEntity.ok(communications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createCommunication(@Valid @RequestBody Communication communication) {
        try {
            Communication createdCommunication = communicationService.createCommunication(communication);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCommunication);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @PostMapping("/contact/{contactId}")
    public ResponseEntity<?> createCommunicationForContact(
            @PathVariable Long contactId, 
            @Valid @RequestBody Communication communication) {
        
        try {
            Communication createdCommunication = communicationService.createCommunicationForContact(contactId, communication);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCommunication);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCommunication(
            @PathVariable Long id, 
            @Valid @RequestBody Communication communicationDetails) {
        
        try {
            Communication updatedCommunication = communicationService.updateCommunication(id, communicationDetails);
            return ResponseEntity.ok(updatedCommunication);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommunication(@PathVariable Long id) {
        try {
            communicationService.deleteCommunication(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Communication deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Communication>> getCommunicationsByType(@PathVariable String type) {
        try {
            CommunicationType communicationType = CommunicationType.valueOf(type.toUpperCase());
            List<Communication> communications = communicationService.getCommunicationsByType(communicationType);
            return ResponseEntity.ok(communications);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Communication>> getCommunicationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        try {
            List<Communication> communications = communicationService.getCommunicationsByDateRange(startDate, endDate);
            return ResponseEntity.ok(communications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Communication>> searchCommunications(@RequestParam String q) {
        try {
            List<Communication> communications = communicationService.searchCommunications(q);
            return ResponseEntity.ok(communications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCommunicationStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", communicationService.getTotalCommunicationCount());
            
            Map<String, Long> typeStats = new HashMap<>();
            for (CommunicationType type : CommunicationType.values()) {
                typeStats.put(type.name().toLowerCase(), communicationService.getCommunicationCountByType(type));
            }
            stats.put("byType", typeStats);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/contact/{contactId}/count")
    public ResponseEntity<Map<String, Long>> getCommunicationCountByContactId(@PathVariable Long contactId) {
        try {
            long count = communicationService.getCommunicationCountByContactId(contactId);
            Map<String, Long> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}