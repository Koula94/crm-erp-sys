package com.kadimar.erp.service;

import com.kadimar.erp.model.Quote;
import com.kadimar.erp.model.QuoteItem;
import com.kadimar.erp.model.QuoteStatus;
import com.kadimar.erp.model.Contact;
import com.kadimar.erp.model.Lead;
import com.kadimar.erp.repository.QuoteRepository;
import com.kadimar.erp.repository.QuoteItemRepository;
import com.kadimar.erp.repository.ContactRepository;
import com.kadimar.erp.repository.LeadRepository;
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
public class QuoteService {
    
    @Autowired
    private QuoteRepository quoteRepository;
    
    @Autowired
    private QuoteItemRepository quoteItemRepository;
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private LeadRepository leadRepository;
    
    public List<Quote> getAllQuotes() {
        return quoteRepository.findAll();
    }
    
    public Optional<Quote> getQuoteById(Long id) {
        return quoteRepository.findById(id);
    }
    
    public Optional<Quote> getQuoteByNumber(String quoteNumber) {
        return quoteRepository.findByQuoteNumber(quoteNumber);
    }
    
    public List<Quote> getQuotesByContactId(Long contactId) {
        return quoteRepository.findByContactId(contactId);
    }
    
    public List<Quote> getQuotesByLeadId(Long leadId) {
        return quoteRepository.findByLeadId(leadId);
    }
    
    public List<Quote> getQuotesByStatus(QuoteStatus status) {
        return quoteRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    public List<Quote> getQuotesByCreatedBy(String createdBy) {
        return quoteRepository.findByCreatedBy(createdBy);
    }
    
    public Quote createQuote(Quote quote) {
        // Validate that the contact exists
        if (quote.getContact() != null && quote.getContact().getId() != null) {
            Contact contact = contactRepository.findById(quote.getContact().getId())
                    .orElseThrow(() -> new RuntimeException("Contact not found with id: " + quote.getContact().getId()));
            quote.setContact(contact);
        } else {
            throw new RuntimeException("Contact is required for quote");
        }
        
        // Validate lead if provided
        if (quote.getLead() != null && quote.getLead().getId() != null) {
            Lead lead = leadRepository.findById(quote.getLead().getId())
                    .orElseThrow(() -> new RuntimeException("Lead not found with id: " + quote.getLead().getId()));
            quote.setLead(lead);
        }
        
        return quoteRepository.save(quote);
    }
    
    public Quote createQuoteForContact(Long contactId, Quote quote) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + contactId));
        
        quote.setContact(contact);
        return quoteRepository.save(quote);
    }
    
    public Quote createQuoteForLead(Long leadId, Quote quote) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + leadId));
        
        quote.setLead(lead);
        quote.setContact(lead.getContact());
        return quoteRepository.save(quote);
    }
    
    public Quote updateQuote(Long id, Quote quoteDetails) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + id));
        
        quote.setTitle(quoteDetails.getTitle());
        quote.setDescription(quoteDetails.getDescription());
        quote.setStatus(quoteDetails.getStatus());
        quote.setTaxAmount(quoteDetails.getTaxAmount());
        quote.setDiscountAmount(quoteDetails.getDiscountAmount());
        quote.setValidUntil(quoteDetails.getValidUntil());
        quote.setCreatedBy(quoteDetails.getCreatedBy());
        quote.setNotes(quoteDetails.getNotes());
        quote.setTerms(quoteDetails.getTerms());
        
        // Update contact if provided
        if (quoteDetails.getContact() != null && quoteDetails.getContact().getId() != null) {
            Contact contact = contactRepository.findById(quoteDetails.getContact().getId())
                    .orElseThrow(() -> new RuntimeException("Contact not found with id: " + quoteDetails.getContact().getId()));
            quote.setContact(contact);
        }
        
        // Update lead if provided
        if (quoteDetails.getLead() != null && quoteDetails.getLead().getId() != null) {
            Lead lead = leadRepository.findById(quoteDetails.getLead().getId())
                    .orElseThrow(() -> new RuntimeException("Lead not found with id: " + quoteDetails.getLead().getId()));
            quote.setLead(lead);
        }
        
        return quoteRepository.save(quote);
    }
    
    public Quote updateQuoteStatus(Long id, QuoteStatus newStatus) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + id));
        
        quote.setStatus(newStatus);
        return quoteRepository.save(quote);
    }
    
    public void deleteQuote(Long id) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + id));
        quoteRepository.delete(quote);
    }
    
    public List<Quote> searchQuotes(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllQuotes();
        }
        return quoteRepository.findBySearchTerm(searchTerm.trim());
    }
    
    public List<Quote> getQuotesByFilters(QuoteStatus status, Long contactId, String createdBy) {
        return quoteRepository.findByFilters(status, contactId, createdBy);
    }
    
    public List<Quote> getExpiredQuotes() {
        return quoteRepository.findExpiredQuotes(LocalDateTime.now());
    }
    
    public void markExpiredQuotes() {
        List<Quote> expiredQuotes = getExpiredQuotes();
        for (Quote quote : expiredQuotes) {
            quote.setStatus(QuoteStatus.EXPIRED);
            quoteRepository.save(quote);
        }
    }
    
    // Quote Items Management
    public List<QuoteItem> getQuoteItems(Long quoteId) {
        return quoteItemRepository.findByQuoteIdOrderBySortOrderAndId(quoteId);
    }
    
    public QuoteItem addQuoteItem(Long quoteId, QuoteItem quoteItem) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + quoteId));
        
        quoteItem.setQuote(quote);
        QuoteItem savedItem = quoteItemRepository.save(quoteItem);
        
        // Recalculate quote totals
        quote.calculateTotals();
        quoteRepository.save(quote);
        
        return savedItem;
    }
    
    public QuoteItem updateQuoteItem(Long itemId, QuoteItem itemDetails) {
        QuoteItem item = quoteItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Quote item not found with id: " + itemId));
        
        item.setName(itemDetails.getName());
        item.setDescription(itemDetails.getDescription());
        item.setQuantity(itemDetails.getQuantity());
        item.setUnitPrice(itemDetails.getUnitPrice());
        item.setUnit(itemDetails.getUnit());
        item.setSortOrder(itemDetails.getSortOrder());
        
        QuoteItem savedItem = quoteItemRepository.save(item);
        
        // Recalculate quote totals
        Quote quote = item.getQuote();
        quote.calculateTotals();
        quoteRepository.save(quote);
        
        return savedItem;
    }
    
    public void deleteQuoteItem(Long itemId) {
        QuoteItem item = quoteItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Quote item not found with id: " + itemId));
        
        Quote quote = item.getQuote();
        quoteItemRepository.delete(item);
        
        // Recalculate quote totals
        quote.calculateTotals();
        quoteRepository.save(quote);
    }
    
    // Analytics methods
    public Map<String, Object> getQuoteAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Count by status
        Map<QuoteStatus, Long> countByStatus = new HashMap<>();
        for (QuoteStatus status : QuoteStatus.values()) {
            countByStatus.put(status, quoteRepository.countByStatus(status));
        }
        analytics.put("countByStatus", countByStatus);
        
        // Value by status
        Map<QuoteStatus, BigDecimal> valueByStatus = new HashMap<>();
        for (QuoteStatus status : QuoteStatus.values()) {
            BigDecimal value = quoteRepository.sumTotalAmountByStatus(status);
            valueByStatus.put(status, value != null ? value : BigDecimal.ZERO);
        }
        analytics.put("valueByStatus", valueByStatus);
        
        // Total quotes
        analytics.put("totalQuotes", quoteRepository.count());
        
        // Total quote value
        BigDecimal totalValue = quoteRepository.findAll().stream()
                .map(Quote::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        analytics.put("totalQuoteValue", totalValue);
        
        return analytics;
    }
    
    public Map<String, Object> getQuoteAnalyticsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Quotes created in period
        long quotesCreated = quoteRepository.countQuotesCreatedBetween(startDate, endDate);
        analytics.put("quotesCreated", quotesCreated);
        
        // Quotes accepted in period
        long quotesAccepted = quoteRepository.countQuotesWithStatusBetween(QuoteStatus.ACCEPTED, startDate, endDate);
        analytics.put("quotesAccepted", quotesAccepted);
        
        // Quotes rejected in period
        long quotesRejected = quoteRepository.countQuotesWithStatusBetween(QuoteStatus.REJECTED, startDate, endDate);
        analytics.put("quotesRejected", quotesRejected);
        
        // Acceptance rate
        Double acceptanceRate = quoteRepository.getAcceptanceRate(startDate, endDate);
        analytics.put("acceptanceRate", acceptanceRate != null ? acceptanceRate : 0.0);
        
        // Average quote value
        BigDecimal averageValue = quoteRepository.getAverageQuoteValue(startDate, endDate);
        analytics.put("averageQuoteValue", averageValue != null ? averageValue : BigDecimal.ZERO);
        
        return analytics;
    }
    
    public Page<Quote> getQuotesWithPagination(QuoteStatus status, Long contactId, String searchTerm, Pageable pageable) {
        return quoteRepository.findByFiltersWithPagination(status, contactId, searchTerm, pageable);
    }
    
    public List<Object[]> getMonthlyRevenue() {
        return quoteRepository.getMonthlyRevenue();
    }
    
    public Map<String, Long> getQuoteCountByCreatedBy() {
        List<Object[]> results = quoteRepository.countQuotesByCreatedBy();
        Map<String, Long> countMap = new HashMap<>();
        
        for (Object[] result : results) {
            String createdBy = (String) result[0];
            Long count = (Long) result[1];
            countMap.put(createdBy, count);
        }
        
        return countMap;
    }
}