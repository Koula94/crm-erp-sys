package com.kadimar.erp.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String client;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;
    
    @Column(nullable = false)
    private Integer progress;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal budget;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private String manager;
    
    @Column(name = "team_size", nullable = false)
    private Integer teamSize;
    
    // Constructors
    public Project() {}
    
    public Project(String name, String client, ProjectStatus status, Integer progress, 
                  LocalDate startDate, LocalDate endDate, BigDecimal budget, 
                  String location, String manager, Integer teamSize) {
        this.name = name;
        this.client = client;
        this.status = status;
        this.progress = progress;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.location = location;
        this.manager = manager;
        this.teamSize = teamSize;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getClient() {
        return client;
    }
    
    public void setClient(String client) {
        this.client = client;
    }
    
    public ProjectStatus getStatus() {
        return status;
    }
    
    public void setStatus(ProjectStatus status) {
        this.status = status;
    }
    
    public Integer getProgress() {
        return progress;
    }
    
    public void setProgress(Integer progress) {
        this.progress = progress;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public BigDecimal getBudget() {
        return budget;
    }
    
    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getManager() {
        return manager;
    }
    
    public void setManager(String manager) {
        this.manager = manager;
    }
    
    public Integer getTeamSize() {
        return teamSize;
    }
    
    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }
}