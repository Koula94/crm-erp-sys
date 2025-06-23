package com.kadimar.erp.service;

import com.kadimar.erp.model.Communication;
import com.kadimar.erp.model.CommunicationType;
import com.kadimar.erp.model.Contact;
import com.kadimar.erp.repository.CommunicationRepository;
import com.kadimar.erp.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommunicationService {
    
    @Autowired
    private CommunicationRepository communicationRepository;
    
    @Autowired
    private ContactRepository contactRepository;
    
    public List<Communication> getAllCommunications() {
        return communicationRepository.findAll();
    }
    
    public Optional<Communication> getCommunicationById(Long id) {
        return communicationRepository.findById(id);
    }
    
    public List<Communication> getCommunicationsByContactId(Long contactId) {
        return communicationRepository.findByContactIdOrderByCommunicationDateDesc(contactId);
    }
    
    public Communication createCommunication(Communication communication) {
        // Validate that the contact exists
        if (communication.getContact() != null && communication.getContact().getId() != null) {
            Contact contact = contactRepository.findById(communication.getContact().getId())
                    .orElseThrow(() -> new RuntimeException("Contact not found with id: " + communication.getContact().getId()));
            communication.setContact(contact);
        } else {
            throw new RuntimeException("Contact is required for communication");
        }
        
        return communicationRepository.save(communication);
    }
    
    public Communication createCommunicationForContact(Long contactId, Communication communication) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + contactId));
        
        communication.setContact(contact);
        return communicationRepository.save(communication);
    }
    
    public Communication updateCommunication(Long id, Communication communicationDetails) {
        Communication communication = communicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Communication not found with id: " + id));
        
        communication.setType(communicationDetails.getType());
        communication.setSubject(communicationDetails.getSubject());
        communication.setContent(communicationDetails.getContent());
        communication.setCommunicationDate(communicationDetails.getCommunicationDate());
        communication.setCreatedBy(communicationDetails.getCreatedBy());
        
        return communicationRepository.save(communication);
    }
    
    public void deleteCommunication(Long id) {
        Communication communication = communicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Communication not found with id: " + id));
        communicationRepository.delete(communication);
    }
    
    public List<Communication> getCommunicationsByType(CommunicationType type) {
        return communicationRepository.findByType(type);
    }
    
    public List<Communication> getCommunicationsByCreatedBy(String createdBy) {
        return communicationRepository.findByCreatedBy(createdBy);
    }
    
    public List<Communication> getCommunicationsByContactIdAndType(Long contactId, CommunicationType type) {
        return communicationRepository.findByContactIdAndType(contactId, type);
    }
    
    public List<Communication> getCommunicationsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return communicationRepository.findByCommunicationDateBetween(startDate, endDate);
    }
    
    public List<Communication> searchCommunications(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllCommunications();
        }
        return communicationRepository.findBySearchTerm(searchTerm.trim());
    }
    
    public List<Communication> getCommunicationsByContactIdAndFilters(Long contactId, String type, String searchTerm) {
        CommunicationType communicationType = null;
        
        if (type != null && !type.equals("all") && !type.trim().isEmpty()) {
            try {
                communicationType = CommunicationType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid type, ignore
            }
        }
        
        String searchTermTrimmed = (searchTerm != null && !searchTerm.trim().isEmpty()) ? searchTerm.trim() : null;
        
        return communicationRepository.findByContactIdAndFilters(contactId, communicationType, searchTermTrimmed);
    }
    
    public Page<Communication> getCommunicationsByContactId(Long contactId, Pageable pageable) {
        return communicationRepository.findByContactIdOrderByCommunicationDateDesc(contactId, pageable);
    }
    
    public long getCommunicationCountByContactId(Long contactId) {
        return communicationRepository.countByContactId(contactId);
    }
    
    public long getCommunicationCountByType(CommunicationType type) {
        return communicationRepository.countByType(type);
    }
    
    public long getTotalCommunicationCount() {
        return communicationRepository.count();
    }
}