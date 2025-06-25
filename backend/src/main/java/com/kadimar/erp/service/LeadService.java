package com.kadimar.erp.service;

import com.kadimar.erp.model.Lead;
import com.kadimar.erp.model.LeadStage;
import com.kadimar.erp.model.Contact;
import com.kadimar.erp.repository.LeadRepository;
import com.kadimar.erp.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
@Transactional
public class LeadService {
    
    @Autowired
    private LeadRepository leadRepository;
    
    @Autowired
    private ContactRepository contactRepository;
    
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }
    
    public Optional<Lead> getLeadById(Long id) {
        return leadRepository.findById(id);
    }
    
    public List<Lead> getLeadsByContactId(Long contactId) {
        return leadRepository.findByContactId(contactId);
    }
    
    public List<Lead> getLeadsByStage(LeadStage stage) {
        return leadRepository.findByStageOrderByCreatedAtDesc(stage);
    }
    
    public List<Lead> getLeadsByAssignedTo(String assignedTo) {
        return leadRepository.findByAssignedTo(assignedTo);
    }
    
    public Lead createLead(Lead lead) {
        // Validate that the contact exists
        if (lead.getContact() != null && lead.getContact().getId() != null) {
            Contact contact = contactRepository.findById(lead.getContact().getId())
                    .orElseThrow(() -> new RuntimeException("Contact not found with id: " + lead.getContact().getId()));
            lead.setContact(contact);
        } else {
            throw new RuntimeException("Contact is required for lead");
        }
        
        return leadRepository.save(lead);
    }
    
    public Lead createLeadForContact(Long contactId, Lead lead) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + contactId));
        
        lead.setContact(contact);
        return leadRepository.save(lead);
    }
    
    public Lead updateLead(Long id, Lead leadDetails) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
        
        lead.setTitle(leadDetails.getTitle());
        lead.setDescription(leadDetails.getDescription());
        lead.setStage(leadDetails.getStage());
        lead.setValue(leadDetails.getValue());
        lead.setProbability(leadDetails.getProbability());
        lead.setExpectedCloseDate(leadDetails.getExpectedCloseDate());
        lead.setSource(leadDetails.getSource());
        lead.setAssignedTo(leadDetails.getAssignedTo());
        lead.setNotes(leadDetails.getNotes());
        
        // Update contact if provided
        if (leadDetails.getContact() != null && leadDetails.getContact().getId() != null) {
            Contact contact = contactRepository.findById(leadDetails.getContact().getId())
                    .orElseThrow(() -> new RuntimeException("Contact not found with id: " + leadDetails.getContact().getId()));
            lead.setContact(contact);
        }
        
        return leadRepository.save(lead);
    }
    
    public Lead updateLeadStage(Long id, LeadStage newStage) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
        
        lead.setStage(newStage);
        return leadRepository.save(lead);
    }
    
    public void deleteLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
        leadRepository.delete(lead);
    }
    
    public List<Lead> searchLeads(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllLeads();
        }
        return leadRepository.findBySearchTerm(searchTerm.trim());
    }
    
    public List<Lead> getLeadsByFilters(LeadStage stage, String assignedTo, Long contactId) {
        return leadRepository.findByFilters(stage, assignedTo, contactId);
    }
    
    public List<Lead> getLeadsByExpectedCloseDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return leadRepository.findByExpectedCloseDateBetween(startDate, endDate);
    }
    
    public List<Lead> getLeadsByValueRange(BigDecimal minValue, BigDecimal maxValue) {
        return leadRepository.findByValueBetween(minValue, maxValue);
    }
    
    // Analytics methods
    public Map<String, Object> getLeadAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Count by stage
        Map<LeadStage, Long> countByStage = new HashMap<>();
        for (LeadStage stage : LeadStage.values()) {
            countByStage.put(stage, leadRepository.countByStage(stage));
        }
        analytics.put("countByStage", countByStage);
        
        // Value by stage
        Map<LeadStage, BigDecimal> valueByStage = new HashMap<>();
        for (LeadStage stage : LeadStage.values()) {
            BigDecimal value = leadRepository.sumValueByStage(stage);
            valueByStage.put(stage, value != null ? value : BigDecimal.ZERO);
        }
        analytics.put("valueByStage", valueByStage);
        
        // Total leads
        analytics.put("totalLeads", leadRepository.count());
        
        // Total pipeline value
        BigDecimal totalValue = leadRepository.findAll().stream()
                .filter(lead -> lead.getValue() != null)
                .map(Lead::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        analytics.put("totalPipelineValue", totalValue);
        
        return analytics;
    }
    
    public Map<String, Object> getLeadAnalyticsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Leads created in period
        long leadsCreated = leadRepository.countLeadsCreatedBetween(startDate, endDate);
        analytics.put("leadsCreated", leadsCreated);
        
        // Leads won in period
        long leadsWon = leadRepository.countLeadsClosedBetween(LeadStage.CLOSED_WON, startDate, endDate);
        analytics.put("leadsWon", leadsWon);
        
        // Leads lost in period
        long leadsLost = leadRepository.countLeadsClosedBetween(LeadStage.CLOSED_LOST, startDate, endDate);
        analytics.put("leadsLost", leadsLost);
        
        // Conversion rate
        Double conversionRate = leadRepository.getConversionRate(startDate, endDate);
        analytics.put("conversionRate", conversionRate != null ? conversionRate : 0.0);
        
        return analytics;
    }
    
    public Page<Lead> getLeadsWithPagination(LeadStage stage, String assignedTo, String searchTerm, Pageable pageable) {
        return leadRepository.findByFiltersWithPagination(stage, assignedTo, searchTerm, pageable);
    }
    
    public List<Lead> getLeadsPipeline() {
        return leadRepository.findAll().stream()
                .filter(lead -> !lead.getStage().isClosedStage())
                .toList();
    }
    
    public BigDecimal calculateWeightedPipelineValue() {
        return leadRepository.findAll().stream()
                .filter(lead -> !lead.getStage().isClosedStage() && lead.getValue() != null && lead.getProbability() != null)
                .map(lead -> lead.getValue().multiply(BigDecimal.valueOf(lead.getProbability())).divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public Map<String, Long> getLeadCountByAssignedTo() {
        List<Object[]> results = leadRepository.countLeadsByAssignedTo();
        Map<String, Long> countMap = new HashMap<>();
        
        for (Object[] result : results) {
            String assignedTo = (String) result[0];
            Long count = (Long) result[1];
            countMap.put(assignedTo, count);
        }
        
        return countMap;
    }
}