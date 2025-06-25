package com.kadimar.erp.service;

import com.kadimar.erp.model.Contact;
import com.kadimar.erp.model.ContactCategory;
import com.kadimar.erp.model.ContactStatus;
import com.kadimar.erp.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
    
    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }
    
    public Optional<Contact> getContactByEmail(String email) {
        return contactRepository.findByEmail(email);
    }
    
    public Contact createContact(Contact contact) {
        // Check if email already exists
        if (contactRepository.findByEmail(contact.getEmail()).isPresent()) {
            throw new RuntimeException("Contact with email " + contact.getEmail() + " already exists");
        }
        return contactRepository.save(contact);
    }
    
    public Contact updateContact(Long id, Contact contactDetails) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        
        // Check if email is being changed and if new email already exists
        if (!contact.getEmail().equals(contactDetails.getEmail())) {
            if (contactRepository.findByEmail(contactDetails.getEmail()).isPresent()) {
                throw new RuntimeException("Contact with email " + contactDetails.getEmail() + " already exists");
            }
        }
        
        contact.setName(contactDetails.getName());
        contact.setEmail(contactDetails.getEmail());
        contact.setPhone(contactDetails.getPhone());
        contact.setCompany(contactDetails.getCompany());
        contact.setPosition(contactDetails.getPosition());
        contact.setAddress(contactDetails.getAddress());
        contact.setCategory(contactDetails.getCategory());
        contact.setStatus(contactDetails.getStatus());
        contact.setAssignedTo(contactDetails.getAssignedTo());
        contact.setSource(contactDetails.getSource());
        contact.setNotes(contactDetails.getNotes());
        
        return contactRepository.save(contact);
    }
    
    public void deleteContact(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        contactRepository.delete(contact);
    }
    
    public List<Contact> getContactsByCategory(ContactCategory category) {
        return contactRepository.findByCategory(category);
    }
    
    public List<Contact> getContactsByStatus(ContactStatus status) {
        return contactRepository.findByStatus(status);
    }
    
    public List<Contact> getContactsByCategoryAndStatus(ContactCategory category, ContactStatus status) {
        return contactRepository.findByCategoryAndStatus(category, status);
    }
    
    public List<Contact> searchContacts(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllContacts();
        }
        return contactRepository.findBySearchTerm(searchTerm.trim());
    }
    
    public List<Contact> getContactsByFilters(String category, String status, String searchTerm) {
        ContactCategory contactCategory = null;
        ContactStatus contactStatus = null;
        
        if (category != null && !category.equals("all") && !category.trim().isEmpty()) {
            try {
                contactCategory = ContactCategory.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid category, ignore
            }
        }
        
        if (status != null && !status.equals("all") && !status.trim().isEmpty()) {
            try {
                contactStatus = ContactStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore
            }
        }
        
        String searchTermTrimmed = (searchTerm != null && !searchTerm.trim().isEmpty()) ? searchTerm.trim() : null;
        
        return contactRepository.findByFilters(contactCategory, contactStatus, searchTermTrimmed);
    }
    
    public Page<Contact> getContactsByFilters(String category, String status, String searchTerm, Pageable pageable) {
        ContactCategory contactCategory = null;
        ContactStatus contactStatus = null;
        
        if (category != null && !category.equals("all") && !category.trim().isEmpty()) {
            try {
                contactCategory = ContactCategory.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid category, ignore
            }
        }
        
        if (status != null && !status.equals("all") && !status.trim().isEmpty()) {
            try {
                contactStatus = ContactStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore
            }
        }
        
        String searchTermTrimmed = (searchTerm != null && !searchTerm.trim().isEmpty()) ? searchTerm.trim() : null;
        
        return contactRepository.findByFilters(contactCategory, contactStatus, searchTermTrimmed, pageable);
    }
    
    public List<Contact> getContactsByAssignedTo(String assignedTo) {
        return contactRepository.findByAssignedTo(assignedTo);
    }
    
    public List<Contact> getContactsByCompany(String company) {
        return contactRepository.findByCompany(company);
    }
    
    public long getContactCountByCategory(ContactCategory category) {
        return contactRepository.countByCategory(category);
    }
    
    public long getContactCountByStatus(ContactStatus status) {
        return contactRepository.countByStatus(status);
    }
    
    public long getTotalContactCount() {
        return contactRepository.count();
    }
}