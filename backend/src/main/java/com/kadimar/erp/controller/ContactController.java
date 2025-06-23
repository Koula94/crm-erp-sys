package com.kadimar.erp.controller;

import com.kadimar.erp.model.Contact;
import com.kadimar.erp.model.ContactCategory;
import com.kadimar.erp.model.ContactStatus;
import com.kadimar.erp.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        
        try {
            List<Contact> contacts;
            
            if (category != null || status != null || search != null) {
                contacts = contactService.getContactsByFilters(category, status, search);
            } else {
                contacts = contactService.getAllContacts();
            }
            
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<Contact>> getContactsPaginated(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : 
                       Sort.by(sortBy).ascending();
            
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Contact> contacts = contactService.getContactsByFilters(category, status, search, pageable);
            
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        try {
            Optional<Contact> contact = contactService.getContactById(id);
            return contact.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<Contact> getContactByEmail(@PathVariable String email) {
        try {
            Optional<Contact> contact = contactService.getContactByEmail(email);
            return contact.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createContact(@Valid @RequestBody Contact contact) {
        try {
            Contact createdContact = contactService.createContact(contact);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdContact);
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
    public ResponseEntity<?> updateContact(@PathVariable Long id, @Valid @RequestBody Contact contactDetails) {
        try {
            Contact updatedContact = contactService.updateContact(id, contactDetails);
            return ResponseEntity.ok(updatedContact);
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
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {
        try {
            contactService.deleteContact(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Contact deleted successfully");
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
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Contact>> getContactsByCategory(@PathVariable String category) {
        try {
            ContactCategory contactCategory = ContactCategory.valueOf(category.toUpperCase());
            List<Contact> contacts = contactService.getContactsByCategory(contactCategory);
            return ResponseEntity.ok(contacts);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Contact>> getContactsByStatus(@PathVariable String status) {
        try {
            ContactStatus contactStatus = ContactStatus.valueOf(status.toUpperCase());
            List<Contact> contacts = contactService.getContactsByStatus(contactStatus);
            return ResponseEntity.ok(contacts);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Contact>> searchContacts(@RequestParam String q) {
        try {
            List<Contact> contacts = contactService.searchContacts(q);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getContactStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", contactService.getTotalContactCount());
            
            Map<String, Long> categoryStats = new HashMap<>();
            for (ContactCategory category : ContactCategory.values()) {
                categoryStats.put(category.name().toLowerCase(), contactService.getContactCountByCategory(category));
            }
            stats.put("byCategory", categoryStats);
            
            Map<String, Long> statusStats = new HashMap<>();
            for (ContactStatus status : ContactStatus.values()) {
                statusStats.put(status.name().toLowerCase(), contactService.getContactCountByStatus(status));
            }
            stats.put("byStatus", statusStats);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}