package com.kadimar.erp.controller;

import com.kadimar.erp.model.Quote;
import com.kadimar.erp.model.QuoteItem;
import com.kadimar.erp.model.QuoteStatus;
import com.kadimar.erp.service.QuoteService;
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
@RequestMapping("/api/quotes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class QuoteController {
    
    @Autowired
    private QuoteService quoteService;
    
    @GetMapping
    public ResponseEntity<List<Quote>> getAllQuotes(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long contactId,
            @RequestParam(required = false) String createdBy,
            @RequestParam(required = false) String search) {
        
        try {
            List<Quote> quotes;
            
            if (search != null && !search.trim().isEmpty()) {
                quotes = quoteService.searchQuotes(search);
            } else if (status != null || contactId != null || createdBy != null) {
                QuoteStatus quoteStatus = status != null ? QuoteStatus.valueOf(status.toUpperCase()) : null;
                quotes = quoteService.getQuotesByFilters(quoteStatus, contactId, createdBy);
            } else {
                quotes = quoteService.getAllQuotes();
            }
            
            return ResponseEntity.ok(quotes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<Quote>> getQuotesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long contactId,
            @RequestParam(required = false) String search) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : 
                       Sort.by(sortBy).ascending();
            
            Pageable pageable = PageRequest.of(page, size, sort);
            QuoteStatus quoteStatus = status != null ? QuoteStatus.valueOf(status.toUpperCase()) : null;
            
            Page<Quote> quotes = quoteService.getQuotesWithPagination(quoteStatus, contactId, search, pageable);
            
            return ResponseEntity.ok(quotes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Quote> getQuoteById(@PathVariable Long id) {
        try {
            Optional<Quote> quote = quoteService.getQuoteById(id);
            return quote.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/number/{quoteNumber}")
    public ResponseEntity<Quote> getQuoteByNumber(@PathVariable String quoteNumber) {
        try {
            Optional<Quote> quote = quoteService.getQuoteByNumber(quoteNumber);
            return quote.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<Quote>> getQuotesByContactId(@PathVariable Long contactId) {
        try {
            List<Quote> quotes = quoteService.getQuotesByContactId(contactId);
            return ResponseEntity.ok(quotes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<Quote>> getQuotesByLeadId(@PathVariable Long leadId) {
        try {
            List<Quote> quotes = quoteService.getQuotesByLeadId(leadId);
            return ResponseEntity.ok(quotes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Quote>> getQuotesByStatus(@PathVariable String status) {
        try {
            QuoteStatus quoteStatus = QuoteStatus.valueOf(status.toUpperCase());
            List<Quote> quotes = quoteService.getQuotesByStatus(quoteStatus);
            return ResponseEntity.ok(quotes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/created-by/{createdBy}")
    public ResponseEntity<List<Quote>> getQuotesByCreatedBy(@PathVariable String createdBy) {
        try {
            List<Quote> quotes = quoteService.getQuotesByCreatedBy(createdBy);
            return ResponseEntity.ok(quotes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/expired")
    public ResponseEntity<List<Quote>> getExpiredQuotes() {
        try {
            List<Quote> quotes = quoteService.getExpiredQuotes();
            return ResponseEntity.ok(quotes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Quote> createQuote(@Valid @RequestBody Quote quote) {
        try {
            Quote createdQuote = quoteService.createQuote(quote);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdQuote);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/contact/{contactId}")
    public ResponseEntity<Quote> createQuoteForContact(
            @PathVariable Long contactId,
            @Valid @RequestBody Quote quote) {
        try {
            Quote createdQuote = quoteService.createQuoteForContact(contactId, quote);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdQuote);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/lead/{leadId}")
    public ResponseEntity<Quote> createQuoteForLead(
            @PathVariable Long leadId,
            @Valid @RequestBody Quote quote) {
        try {
            Quote createdQuote = quoteService.createQuoteForLead(leadId, quote);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdQuote);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Quote> updateQuote(
            @PathVariable Long id,
            @Valid @RequestBody Quote quoteDetails) {
        try {
            Quote updatedQuote = quoteService.updateQuote(id, quoteDetails);
            return ResponseEntity.ok(updatedQuote);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Quote> updateQuoteStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            QuoteStatus quoteStatus = QuoteStatus.valueOf(status.toUpperCase());
            Quote updatedQuote = quoteService.updateQuoteStatus(id, quoteStatus);
            return ResponseEntity.ok(updatedQuote);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/mark-expired")
    public ResponseEntity<Map<String, String>> markExpiredQuotes() {
        try {
            quoteService.markExpiredQuotes();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Expired quotes have been marked");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuote(@PathVariable Long id) {
        try {
            quoteService.deleteQuote(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Quote Items endpoints
    @GetMapping("/{quoteId}/items")
    public ResponseEntity<List<QuoteItem>> getQuoteItems(@PathVariable Long quoteId) {
        try {
            List<QuoteItem> items = quoteService.getQuoteItems(quoteId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/{quoteId}/items")
    public ResponseEntity<QuoteItem> addQuoteItem(
            @PathVariable Long quoteId,
            @Valid @RequestBody QuoteItem quoteItem) {
        try {
            QuoteItem createdItem = quoteService.addQuoteItem(quoteId, quoteItem);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/items/{itemId}")
    public ResponseEntity<QuoteItem> updateQuoteItem(
            @PathVariable Long itemId,
            @Valid @RequestBody QuoteItem itemDetails) {
        try {
            QuoteItem updatedItem = quoteService.updateQuoteItem(itemId, itemDetails);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteQuoteItem(@PathVariable Long itemId) {
        try {
            quoteService.deleteQuoteItem(itemId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Analytics endpoints
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getQuoteAnalytics() {
        try {
            Map<String, Object> analytics = quoteService.getQuoteAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/analytics/date-range")
    public ResponseEntity<Map<String, Object>> getQuoteAnalyticsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<String, Object> analytics = quoteService.getQuoteAnalyticsByDateRange(startDate, endDate);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/analytics/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics() {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("monthlyRevenue", quoteService.getMonthlyRevenue());
            result.put("quoteCountByCreatedBy", quoteService.getQuoteCountByCreatedBy());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}