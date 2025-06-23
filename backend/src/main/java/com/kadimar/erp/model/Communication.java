package com.kadimar.erp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "communications")
public class Communication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunicationType type;
    
    @NotBlank(message = "Subject is required")
    @Size(max = 200)
    @Column(nullable = false)
    private String subject;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "communication_date", nullable = false)
    private LocalDateTime communicationDate;
    
    @Size(max = 50)
    private String createdBy;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (communicationDate == null) {
            communicationDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Communication() {}
    
    public Communication(Contact contact, CommunicationType type, String subject, String content) {
        this.contact = contact;
        this.type = type;
        this.subject = subject;
        this.content = content;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Contact getContact() {
        return contact;
    }
    
    public void setContact(Contact contact) {
        this.contact = contact;
    }
    
    public CommunicationType getType() {
        return type;
    }
    
    public void setType(CommunicationType type) {
        this.type = type;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public LocalDateTime getCommunicationDate() {
        return communicationDate;
    }
    
    public void setCommunicationDate(LocalDateTime communicationDate) {
        this.communicationDate = communicationDate;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}