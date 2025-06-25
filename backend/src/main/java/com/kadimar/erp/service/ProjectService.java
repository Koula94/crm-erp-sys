package com.kadimar.erp.service;

import com.kadimar.erp.model.Project;
import com.kadimar.erp.model.ProjectStatus;
import com.kadimar.erp.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }
    
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }
    
    public Project updateProject(Long id, Project projectDetails) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            project.setName(projectDetails.getName());
            project.setClient(projectDetails.getClient());
            project.setStatus(projectDetails.getStatus());
            project.setProgress(projectDetails.getProgress());
            project.setStartDate(projectDetails.getStartDate());
            project.setEndDate(projectDetails.getEndDate());
            project.setBudget(projectDetails.getBudget());
            project.setLocation(projectDetails.getLocation());
            project.setManager(projectDetails.getManager());
            project.setTeamSize(projectDetails.getTeamSize());
            return projectRepository.save(project);
        }
        throw new RuntimeException("Project not found with id: " + id);
    }
    
    public void deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
        } else {
            throw new RuntimeException("Project not found with id: " + id);
        }
    }
    
    public List<Project> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }
    
    public List<Project> getProjectsByClient(String client) {
        return projectRepository.findByClient(client);
    }
    
    public List<Project> getProjectsByManager(String manager) {
        return projectRepository.findByManager(manager);
    }
    
    public List<Project> searchProjects(String searchTerm) {
        return projectRepository.findByNameOrClientContaining(searchTerm);
    }
    
    public List<Project> getActiveProjects() {
        return projectRepository.findActiveProjectsOrderByEndDate();
    }
}