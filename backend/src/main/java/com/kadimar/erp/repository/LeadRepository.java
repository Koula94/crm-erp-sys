package com.kadimar.erp.repository;

import com.kadimar.erp.model.Lead;
import com.kadimar.erp.model.LeadStage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    
    List<Lead> findByContactId(Long contactId);
    
    List<Lead> findByStage(LeadStage stage);
    
    List<Lead> findByAssignedTo(String assignedTo);
    
    @Query("SELECT l FROM Lead l WHERE l.stage = :stage ORDER BY l.createdAt DESC")
    List<Lead> findByStageOrderByCreatedAtDesc(@Param("stage") LeadStage stage);
    
    @Query("SELECT l FROM Lead l WHERE " +
           "(:stage IS NULL OR l.stage = :stage) AND " +
           "(:assignedTo IS NULL OR l.assignedTo = :assignedTo) AND " +
           "(:contactId IS NULL OR l.contact.id = :contactId)")
    List<Lead> findByFilters(@Param("stage") LeadStage stage,
                           @Param("assignedTo") String assignedTo,
                           @Param("contactId") Long contactId);
    
    @Query("SELECT l FROM Lead l WHERE " +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.contact.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.contact.company) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Lead> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT l FROM Lead l WHERE " +
           "l.expectedCloseDate BETWEEN :startDate AND :endDate")
    List<Lead> findByExpectedCloseDateBetween(@Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT l FROM Lead l WHERE " +
           "l.value BETWEEN :minValue AND :maxValue")
    List<Lead> findByValueBetween(@Param("minValue") BigDecimal minValue,
                                @Param("maxValue") BigDecimal maxValue);
    
    // Analytics queries
    @Query("SELECT COUNT(l) FROM Lead l WHERE l.stage = :stage")
    long countByStage(@Param("stage") LeadStage stage);
    
    @Query("SELECT SUM(l.value) FROM Lead l WHERE l.stage = :stage")
    BigDecimal sumValueByStage(@Param("stage") LeadStage stage);
    
    @Query("SELECT l.stage, COUNT(l) FROM Lead l GROUP BY l.stage")
    List<Object[]> countLeadsByStage();
    
    @Query("SELECT l.stage, SUM(l.value) FROM Lead l WHERE l.value IS NOT NULL GROUP BY l.stage")
    List<Object[]> sumValueByStage();
    
    @Query("SELECT l.assignedTo, COUNT(l) FROM Lead l WHERE l.assignedTo IS NOT NULL GROUP BY l.assignedTo")
    List<Object[]> countLeadsByAssignedTo();
    
    @Query("SELECT COUNT(l) FROM Lead l WHERE " +
           "l.createdAt >= :startDate AND l.createdAt <= :endDate")
    long countLeadsCreatedBetween(@Param("startDate") LocalDateTime startDate,
                                @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(l) FROM Lead l WHERE " +
           "l.stage = :stage AND l.updatedAt >= :startDate AND l.updatedAt <= :endDate")
    long countLeadsClosedBetween(@Param("stage") LeadStage stage,
                               @Param("startDate") LocalDateTime startDate,
                               @Param("endDate") LocalDateTime endDate);
    
    // Conversion rate calculation
    @Query("SELECT " +
           "(SELECT COUNT(l1) FROM Lead l1 WHERE l1.stage = 'CLOSED_WON' AND l1.createdAt >= :startDate AND l1.createdAt <= :endDate) * 100.0 / " +
           "(SELECT COUNT(l2) FROM Lead l2 WHERE l2.createdAt >= :startDate AND l2.createdAt <= :endDate)")
    Double getConversionRate(@Param("startDate") LocalDateTime startDate,
                           @Param("endDate") LocalDateTime endDate);
    
    Page<Lead> findByStageOrderByCreatedAtDesc(LeadStage stage, Pageable pageable);
    
    Page<Lead> findByAssignedToOrderByCreatedAtDesc(String assignedTo, Pageable pageable);
    
    @Query("SELECT l FROM Lead l WHERE " +
           "(:stage IS NULL OR l.stage = :stage) AND " +
           "(:assignedTo IS NULL OR l.assignedTo = :assignedTo) AND " +
           "(:searchTerm IS NULL OR " +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.contact.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Lead> findByFiltersWithPagination(@Param("stage") LeadStage stage,
                                         @Param("assignedTo") String assignedTo,
                                         @Param("searchTerm") String searchTerm,
                                         Pageable pageable);
}