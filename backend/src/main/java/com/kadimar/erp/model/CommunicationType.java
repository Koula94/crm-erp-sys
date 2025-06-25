package com.kadimar.erp.model;

public enum CommunicationType {
    CALL("Call"),
    EMAIL("Email"),
    MEETING("Meeting"),
    NOTE("Note"),
    TASK("Task");
    
    private final String displayName;
    
    CommunicationType(String displayName) {
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