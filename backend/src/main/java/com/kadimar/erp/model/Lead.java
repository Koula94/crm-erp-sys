package com.kadimar.erp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
public class Lead {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Lead title is required")
    @Size(max = 200)
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    @NotNull(message = "Contact is required")
    private Contact contact;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadStage stage;
    
    @DecimalMin(value = "0.0", message = "Value must be positive")
    @Column(precision = 15, scale = 2)
    private BigDecimal value;
    
    @Column(name = "probability")
    private Integer probability; // 0-100
    
    @Column(name = "expected_close_date")
    private LocalDateTime expectedCloseDate;
    
    @Size(max = 100)
    private String source;
    
    @Size(max = 50)
    private String assignedTo;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (stage == null) {
            stage = LeadStage.PROSPECT;
        }
        if (probability == null) {
            probability = getDefaultProbabilityForStage(stage);
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    private Integer getDefaultProbabilityForStage(LeadStage stage) {
        return switch (stage) {
            case PROSPECT -> 10;
            case QUALIFIED -> 25;
            case PROPOSAL -> 50;
            case NEGOTIATION -> 75;
            case CLOSED_WON -> 100;
            case CLOSED_LOST -> 0;
        };
    }
    
    // Constructors
    public Lead() {}
    
    public Lead(String title, Contact contact, LeadStage stage) {
        this.title = title;
        this.contact = contact;
        this.stage = stage;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Contact getContact() {
        return contact;
    }
    
    public void setContact(Contact contact) {
        this.contact = contact;
    }
    
    public LeadStage getStage() {
        return stage;
    }
    
    public void setStage(LeadStage stage) {
        this.stage = stage;
        // Auto-update probability when stage changes
        if (this.probability == null || this.probability.equals(getDefaultProbabilityForStage(this.stage))) {
            this.probability = getDefaultProbabilityForStage(stage);
        }
    }
    
    public BigDecimal getValue() {
        return value;
    }
    
    public void setValue(BigDecimal value) {
        this.value = value;
    }
    
    public Integer getProbability() {
        return probability;
    }
    
    public void setProbability(Integer probability) {
        this.probability = probability;
    }
    
    public LocalDateTime getExpectedCloseDate() {
        return expectedCloseDate;
    }
    
    public void setExpectedCloseDate(LocalDateTime expectedCloseDate) {
        this.expectedCloseDate = expectedCloseDate;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public String getAssignedTo() {
        return assignedTo;
    }
    
    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
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