package com.kadimar.erp.repository;

import com.kadimar.erp.model.Contact;
import com.kadimar.erp.model.ContactCategory;
import com.kadimar.erp.model.ContactStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    Optional<Contact> findByEmail(String email);
    
    List<Contact> findByCategory(ContactCategory category);
    
    List<Contact> findByStatus(ContactStatus status);
    
    List<Contact> findByCategoryAndStatus(ContactCategory category, ContactStatus status);
    
    @Query("SELECT c FROM Contact c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.company) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Contact> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT c FROM Contact c WHERE " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:searchTerm IS NULL OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.company) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Contact> findByFilters(@Param("category") ContactCategory category,
                               @Param("status") ContactStatus status,
                               @Param("searchTerm") String searchTerm);
    
    @Query("SELECT c FROM Contact c WHERE " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:searchTerm IS NULL OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.company) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Contact> findByFilters(@Param("category") ContactCategory category,
                               @Param("status") ContactStatus status,
                               @Param("searchTerm") String searchTerm,
                               Pageable pageable);
    
    List<Contact> findByAssignedTo(String assignedTo);
    
    List<Contact> findByCompany(String company);
    
    @Query("SELECT COUNT(c) FROM Contact c WHERE c.category = :category")
    long countByCategory(@Param("category") ContactCategory category);
    
    @Query("SELECT COUNT(c) FROM Contact c WHERE c.status = :status")
    long countByStatus(@Param("status") ContactStatus status);
}