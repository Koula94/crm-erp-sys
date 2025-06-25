package com.kadimar.erp.model;

public enum LeadStage {
    PROSPECT("Prospect", "#6B7280"),
    QUALIFIED("Qualified", "#3B82F6"),
    PROPOSAL("Proposal", "#F59E0B"),
    NEGOTIATION("Negotiation", "#8B5CF6"),
    CLOSED_WON("Closed Won", "#10B981"),
    CLOSED_LOST("Closed Lost", "#EF4444");
    
    private final String displayName;
    private final String color;
    
    LeadStage(String displayName, String color) {
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
    
    public boolean isClosedStage() {
        return this == CLOSED_WON || this == CLOSED_LOST;
    }
    
    public boolean isWonStage() {
        return this == CLOSED_WON;
    }
    
    public boolean isLostStage() {
        return this == CLOSED_LOST;
    }
}