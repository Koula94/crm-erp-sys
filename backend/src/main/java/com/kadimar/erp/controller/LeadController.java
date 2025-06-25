package com.kadimar.erp.controller;

import com.kadimar.erp.model.Lead;
import com.kadimar.erp.model.LeadStage;
import com.kadimar.erp.service.LeadService;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class LeadController {
    
    @Autowired
    private LeadService leadService;
    
    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads(
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) String assignedTo,
            @RequestParam(required = false) Long contactId,
            @RequestParam(required = false) String search) {
        
        try {
            List<Lead> leads;
            
            if (search != null && !search.trim().isEmpty()) {
                leads = leadService.searchLeads(search);
            } else if (stage != null || assignedTo != null || contactId != null) {
                LeadStage leadStage = stage != null ? LeadStage.valueOf(stage.toUpperCase()) : null;
                leads = leadService.getLeadsByFilters(leadStage, assignedTo, contactId);
            } else {
                leads = leadService.getAllLeads();
            }
            
            return ResponseEntity.ok(leads);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<Lead>> getLeadsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) String assignedTo,
            @RequestParam(required = false) String search) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : 
                       Sort.by(sortBy).ascending();
            
            Pageable pageable = PageRequest.of(page, size, sort);
            LeadStage leadStage = stage != null ? LeadStage.valueOf(stage.toUpperCase()) : null;
            
            Page<Lead> leads = leadService.getLeadsWithPagination(leadStage, assignedTo, search, pageable);
            
            return ResponseEntity.ok(leads);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        try {
            Optional<Lead> lead = leadService.getLeadById(id);
            return lead.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<Lead>> getLeadsByContactId(@PathVariable Long contactId) {
        try {
            List<Lead> leads = leadService.getLeadsByContactId(contactId);
            return ResponseEntity.ok(leads);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/stage/{stage}")
    public ResponseEntity<List<Lead>> getLeadsByStage(@PathVariable String stage) {
        try {
            LeadStage leadStage = LeadStage.valueOf(stage.toUpperCase());
            List<Lead> leads = leadService.getLeadsByStage(leadStage);
            return ResponseEntity.ok(leads);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/assigned/{assignedTo}")
    public ResponseEntity<List<Lead>> getLeadsByAssignedTo(@PathVariable String assignedTo) {
        try {
            List<Lead> leads = leadService.getLeadsByAssignedTo(assignedTo);
            return ResponseEntity.ok(leads);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/pipeline")
    public ResponseEntity<List<Lead>> getLeadsPipeline() {
        try {
            List<Lead> leads = leadService.getLeadsPipeline();
            return ResponseEntity.ok(leads);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Lead> createLead(@Valid @RequestBody Lead lead) {
        try {
            Lead createdLead = leadService.createLead(lead);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdLead);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/contact/{contactId}")
    public ResponseEntity<Lead> createLeadForContact(
            @PathVariable Long contactId,
            @Valid @RequestBody Lead lead) {
        try {
            Lead createdLead = leadService.createLeadForContact(contactId, lead);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdLead);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody Lead leadDetails) {
        try {
            Lead updatedLead = leadService.updateLead(id, leadDetails);
            return ResponseEntity.ok(updatedLead);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PatchMapping("/{id}/stage")
    public ResponseEntity<Lead> updateLeadStage(
            @PathVariable Long id,
            @RequestParam String stage) {
        try {
            LeadStage leadStage = LeadStage.valueOf(stage.toUpperCase());
            Lead updatedLead = leadService.updateLeadStage(id, leadStage);
            return ResponseEntity.ok(updatedLead);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        try {
            leadService.deleteLead(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getLeadAnalytics() {
        try {
            Map<String, Object> analytics = leadService.getLeadAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/analytics/date-range")
    public ResponseEntity<Map<String, Object>> getLeadAnalyticsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<String, Object> analytics = leadService.getLeadAnalyticsByDateRange(startDate, endDate);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/analytics/pipeline-value")
    public ResponseEntity<Map<String, Object>> getPipelineValue() {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("weightedPipelineValue", leadService.calculateWeightedPipelineValue());
            result.put("leadCountByAssignedTo", leadService.getLeadCountByAssignedTo());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/value-range")
    public ResponseEntity<List<Lead>> getLeadsByValueRange(
            @RequestParam BigDecimal minValue,
            @RequestParam BigDecimal maxValue) {
        try {
            List<Lead> leads = leadService.getLeadsByValueRange(minValue, maxValue);
            return ResponseEntity.ok(leads);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/expected-close-date")
    public ResponseEntity<List<Lead>> getLeadsByExpectedCloseDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<Lead> leads = leadService.getLeadsByExpectedCloseDateRange(startDate, endDate);
            return ResponseEntity.ok(leads);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}