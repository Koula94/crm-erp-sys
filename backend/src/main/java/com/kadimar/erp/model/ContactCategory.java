package com.kadimar.erp.model;

public enum ContactCategory {
    CLIENT("Client"),
    PROSPECT("Prospect"),
    PARTNER("Partner"),
    VENDOR("Vendor");
    
    private final String displayName;
    
    ContactCategory(String displayName) {
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