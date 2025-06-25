package com.kadimar.erp.model;

public enum QuoteStatus {
    DRAFT("Draft", "#6B7280"),
    SENT("Sent", "#3B82F6"),
    VIEWED("Viewed", "#8B5CF6"),
    ACCEPTED("Accepted", "#10B981"),
    REJECTED("Rejected", "#EF4444"),
    EXPIRED("Expired", "#F59E0B"),
    REVISED("Revised", "#F97316");
    
    private final String displayName;
    private final String color;
    
    QuoteStatus(String displayName, String color) {
        this.displayName = displayName;
        this.color = color;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getColor() {
        return color;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    public boolean isClosedStatus() {
        return this == ACCEPTED || this == REJECTED || this == EXPIRED;
    }
    
    public boolean isActiveStatus() {
        return this == SENT || this == VIEWED || this == REVISED;
    }
    
    public boolean isDraftStatus() {
        return this == DRAFT;
    }
}