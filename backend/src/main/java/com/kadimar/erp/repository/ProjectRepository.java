package com.kadimar.erp.repository;

import com.kadimar.erp.model.Project;
import com.kadimar.erp.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByStatus(ProjectStatus status);
    
    List<Project> findByClient(String client);
    
    List<Project> findByManager(String manager);
    
    @Query("SELECT p FROM Project p WHERE p.name LIKE %?1% OR p.client LIKE %?1%")
    List<Project> findByNameOrClientContaining(String searchTerm);
    
    @Query("SELECT p FROM Project p WHERE p.progress < 100 ORDER BY p.endDate ASC")
    List<Project> findActiveProjectsOrderByEndDate();
}