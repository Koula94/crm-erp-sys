package com.kadimar.erp.repository;

import com.kadimar.erp.model.QuoteItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface QuoteItemRepository extends JpaRepository<QuoteItem, Long> {
    
    List<QuoteItem> findByQuoteId(Long quoteId);
    
    List<QuoteItem> findByQuoteIdOrderBySortOrder(Long quoteId);
    
    @Query("SELECT qi FROM QuoteItem qi WHERE qi.quote.id = :quoteId ORDER BY qi.sortOrder ASC, qi.id ASC")
    List<QuoteItem> findByQuoteIdOrderBySortOrderAndId(@Param("quoteId") Long quoteId);
    
    @Query("SELECT SUM(qi.totalPrice) FROM QuoteItem qi WHERE qi.quote.id = :quoteId")
    BigDecimal sumTotalPriceByQuoteId(@Param("quoteId") Long quoteId);
    
    @Query("SELECT COUNT(qi) FROM QuoteItem qi WHERE qi.quote.id = :quoteId")
    long countByQuoteId(@Param("quoteId") Long quoteId);
    
    @Query("SELECT qi FROM QuoteItem qi WHERE " +
           "LOWER(qi.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(qi.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<QuoteItem> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT qi.name, SUM(qi.quantity) FROM QuoteItem qi " +
           "WHERE qi.quote.status = 'ACCEPTED' " +
           "GROUP BY qi.name " +
           "ORDER BY SUM(qi.quantity) DESC")
    List<Object[]> getMostSoldItems();
    
    @Query("SELECT qi.name, AVG(qi.unitPrice) FROM QuoteItem qi " +
           "GROUP BY qi.name " +
           "ORDER BY qi.name")
    List<Object[]> getAverageItemPrices();
    
    void deleteByQuoteId(Long quoteId);
}