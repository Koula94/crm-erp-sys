package com.kadimar.erp.repository;

import com.kadimar.erp.model.Communication;
import com.kadimar.erp.model.CommunicationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommunicationRepository extends JpaRepository<Communication, Long> {
    
    List<Communication> findByContactId(Long contactId);
    
    List<Communication> findByContactIdOrderByCommunicationDateDesc(Long contactId);
    
    List<Communication> findByType(CommunicationType type);
    
    List<Communication> findByCreatedBy(String createdBy);
    
    @Query("SELECT c FROM Communication c WHERE c.contact.id = :contactId AND c.type = :type")
    List<Communication> findByContactIdAndType(@Param("contactId") Long contactId, 
                                             @Param("type") CommunicationType type);
    
    @Query("SELECT c FROM Communication c WHERE " +
           "c.communicationDate BETWEEN :startDate AND :endDate")
    List<Communication> findByCommunicationDateBetween(@Param("startDate") LocalDateTime startDate,
                                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT c FROM Communication c WHERE " +
           "LOWER(c.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Communication> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    Page<Communication> findByContactIdOrderByCommunicationDateDesc(Long contactId, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Communication c WHERE c.contact.id = :contactId")
    long countByContactId(@Param("contactId") Long contactId);
    
    @Query("SELECT COUNT(c) FROM Communication c WHERE c.type = :type")
    long countByType(@Param("type") CommunicationType type);
    
    @Query("SELECT c FROM Communication c WHERE " +
           "c.contact.id = :contactId AND " +
           "(:type IS NULL OR c.type = :type) AND " +
           "(:searchTerm IS NULL OR " +
           "LOWER(c.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Communication> findByContactIdAndFilters(@Param("contactId") Long contactId,
                                                 @Param("type") CommunicationType type,
                                                 @Param("searchTerm") String searchTerm);
}