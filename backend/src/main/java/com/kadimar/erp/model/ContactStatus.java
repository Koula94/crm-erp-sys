package com.kadimar.erp.model;

public enum ContactStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    PROSPECT("Prospect");
    
    private final String displayName;
    
    ContactStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
}