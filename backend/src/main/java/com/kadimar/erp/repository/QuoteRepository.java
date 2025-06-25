package com.kadimar.erp.repository;

import com.kadimar.erp.model.Quote;
import com.kadimar.erp.model.QuoteStatus;
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
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    
    Optional<Quote> findByQuoteNumber(String quoteNumber);
    
    List<Quote> findByContactId(Long contactId);
    
    List<Quote> findByLeadId(Long leadId);
    
    List<Quote> findByStatus(QuoteStatus status);
    
    List<Quote> findByCreatedBy(String createdBy);
    
    @Query("SELECT q FROM Quote q WHERE q.status = :status ORDER BY q.createdAt DESC")
    List<Quote> findByStatusOrderByCreatedAtDesc(@Param("status") QuoteStatus status);
    
    @Query("SELECT q FROM Quote q WHERE " +
           "(:status IS NULL OR q.status = :status) AND " +
           "(:contactId IS NULL OR q.contact.id = :contactId) AND " +
           "(:createdBy IS NULL OR q.createdBy = :createdBy)")
    List<Quote> findByFilters(@Param("status") QuoteStatus status,
                            @Param("contactId") Long contactId,
                            @Param("createdBy") String createdBy);
    
    @Query("SELECT q FROM Quote q WHERE " +
           "LOWER(q.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(q.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(q.quoteNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(q.contact.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(q.contact.company) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Quote> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT q FROM Quote q WHERE " +
           "q.validUntil BETWEEN :startDate AND :endDate")
    List<Quote> findByValidUntilBetween(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT q FROM Quote q WHERE " +
           "q.totalAmount BETWEEN :minAmount AND :maxAmount")
    List<Quote> findByTotalAmountBetween(@Param("minAmount") BigDecimal minAmount,
                                       @Param("maxAmount") BigDecimal maxAmount);
    
    @Query("SELECT q FROM Quote q WHERE " +
           "q.validUntil < :currentDate AND q.status NOT IN ('ACCEPTED', 'REJECTED', 'EXPIRED')")
    List<Quote> findExpiredQuotes(@Param("currentDate") LocalDateTime currentDate);
    
    // Analytics queries
    @Query("SELECT COUNT(q) FROM Quote q WHERE q.status = :status")
    long countByStatus(@Param("status") QuoteStatus status);
    
    @Query("SELECT SUM(q.totalAmount) FROM Quote q WHERE q.status = :status")
    BigDecimal sumTotalAmountByStatus(@Param("status") QuoteStatus status);
    
    @Query("SELECT q.status, COUNT(q) FROM Quote q GROUP BY q.status")
    List<Object[]> countQuotesByStatus();
    
    @Query("SELECT q.status, SUM(q.totalAmount) FROM Quote q GROUP BY q.status")
    List<Object[]> sumTotalAmountByStatus();
    
    @Query("SELECT q.createdBy, COUNT(q) FROM Quote q WHERE q.createdBy IS NOT NULL GROUP BY q.createdBy")
    List<Object[]> countQuotesByCreatedBy();
    
    @Query("SELECT COUNT(q) FROM Quote q WHERE " +
           "q.createdAt >= :startDate AND q.createdAt <= :endDate")
    long countQuotesCreatedBetween(@Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(q) FROM Quote q WHERE " +
           "q.status = :status AND q.updatedAt >= :startDate AND q.updatedAt <= :endDate")
    long countQuotesWithStatusBetween(@Param("status") QuoteStatus status,
                                    @Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);
    
    // Conversion rate calculation
    @Query("SELECT " +
           "(SELECT COUNT(q1) FROM Quote q1 WHERE q1.status = 'ACCEPTED' AND q1.createdAt >= :startDate AND q1.createdAt <= :endDate) * 100.0 / " +
           "(SELECT COUNT(q2) FROM Quote q2 WHERE q2.createdAt >= :startDate AND q2.createdAt <= :endDate)")
    Double getAcceptanceRate(@Param("startDate") LocalDateTime startDate,
                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(q.totalAmount) FROM Quote q WHERE " +
           "q.createdAt >= :startDate AND q.createdAt <= :endDate")
    BigDecimal getAverageQuoteValue(@Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);
    
    Page<Quote> findByStatusOrderByCreatedAtDesc(QuoteStatus status, Pageable pageable);
    
    Page<Quote> findByContactIdOrderByCreatedAtDesc(Long contactId, Pageable pageable);
    
    @Query("SELECT q FROM Quote q WHERE " +
           "(:status IS NULL OR q.status = :status) AND " +
           "(:contactId IS NULL OR q.contact.id = :contactId) AND " +
           "(:searchTerm IS NULL OR " +
           "LOWER(q.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(q.quoteNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(q.contact.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Quote> findByFiltersWithPagination(@Param("status") QuoteStatus status,
                                          @Param("contactId") Long contactId,
                                          @Param("searchTerm") String searchTerm,
                                          Pageable pageable);
    
    @Query("SELECT YEAR(q.createdAt), MONTH(q.createdAt), SUM(q.totalAmount) " +
           "FROM Quote q WHERE q.status = 'ACCEPTED' " +
           "GROUP BY YEAR(q.createdAt), MONTH(q.createdAt) " +
           "ORDER BY YEAR(q.createdAt), MONTH(q.createdAt)")
    List<Object[]> getMonthlyRevenue();
}