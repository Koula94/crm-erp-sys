// API Contact interface matching Spring Boot entity
export interface ApiContact {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  category: 'CLIENT' | 'PROSPECT' | 'PARTNER' | 'VENDOR';
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  assignedTo?: string;
  source?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  communications?: ApiCommunication[];
}

// API Communication interface matching Spring Boot entity
export interface ApiCommunication {
  id?: number;
  contactId: number;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK';
  subject: string;
  content?: string;
  communicationDate?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response interface for error handling
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Contact statistics interface
export interface ContactStats {
  totalContacts: number;
  activeContacts: number;
  inactiveContacts: number;
  prospects: number;
}

// Mapping functions between API and UI types
export const mapApiContactToContact = (apiContact: ApiContact): any => {
  return {
    id: apiContact.id?.toString() || '',
    name: apiContact.name,
    email: apiContact.email,
    phone: apiContact.phone || '',
    company: apiContact.company,
    position: apiContact.position,
    address: apiContact.address || '',
    category: mapApiCategoryToUI(apiContact.category),
    status: mapApiStatusToUI(apiContact.status),
    assignedTo: apiContact.assignedTo,
    source: apiContact.source || '',
    notes: apiContact.notes || '',
    createdAt: apiContact.createdAt || new Date().toISOString(),
    updatedAt: apiContact.updatedAt || new Date().toISOString(),
    tags: [],
    socialMedia: {}
  };
};

export const mapContactToApiContact = (contact: any): Omit<ApiContact, 'id'> => {
  return {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    position: contact.position,
    address: contact.address,
    category: mapUICategoryToApi(contact.category),
    status: mapUIStatusToApi(contact.status),
    assignedTo: contact.assignedTo,
    source: contact.source,
    notes: contact.notes
  };
};

const mapApiCategoryToUI = (apiCategory: string): string => {
  switch (apiCategory) {
    case 'CLIENT': return 'Client';
    case 'PROSPECT': return 'Prospect';
    case 'PARTNER': return 'Partner';
    case 'VENDOR': return 'Vendor';
    default: return 'Prospect';
  }
};

const mapUICategoryToApi = (uiCategory: string): 'CLIENT' | 'PROSPECT' | 'PARTNER' | 'VENDOR' => {
  switch (uiCategory) {
    case 'Client': return 'CLIENT';
    case 'Prospect': return 'PROSPECT';
    case 'Partner': return 'PARTNER';
    case 'Vendor': return 'VENDOR';
    default: return 'PROSPECT';
  }
};

const mapApiStatusToUI = (apiStatus: string): string => {
  switch (apiStatus) {
    case 'ACTIVE': return 'Active';
    case 'INACTIVE': return 'Inactive';
    case 'PROSPECT': return 'Prospect';
    default: return 'Prospect';
  }
};

const mapUIStatusToApi = (uiStatus: string): 'ACTIVE' | 'INACTIVE' | 'PROSPECT' => {
  switch (uiStatus) {
    case 'Active': return 'ACTIVE';
    case 'Inactive': return 'INACTIVE';
    case 'Prospect': return 'PROSPECT';
    default: return 'PROSPECT';
  }
};

// API Lead interface matching Spring Boot entity
export interface ApiLead {
  id?: number;
  contactId?: number;
  title: string;
  description?: string;
  value: number;
  stage: 'PROSPECT' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  probability: number;
  expectedCloseDate?: string;
  assignedUserId?: number;
  source?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Quote interface matching Spring Boot entity
export interface ApiQuote {
  id?: number;
  quoteNumber?: string;
  contactId: number;
  leadId?: number;
  title: string;
  description?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  validUntil?: string;
  terms?: string;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: ApiQuoteItem[];
}

// API Quote Item interface
export interface ApiQuoteItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
}

// Lead statistics interface
export interface LeadStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  closedWonLeads: number;
  totalPipelineValue: number;
  averageDealSize: number;
  conversionRate: number;
}

// Quote statistics interface
export interface QuoteStats {
  totalQuotes: number;
  draftQuotes: number;
  sentQuotes: number;
  acceptedQuotes: number;
  totalQuoteValue: number;
  averageQuoteValue: number;
  acceptanceRate: number;
}

// CRM API Service
export class ApiCrmService {
  private static instance: ApiCrmService;
  private baseUrl: string;

  private constructor() {
    // Use environment variable or default to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
  }

  static getInstance(): ApiCrmService {
    if (!ApiCrmService.instance) {
      ApiCrmService.instance = new ApiCrmService();
    }
    return ApiCrmService.instance;
  }

  // Health check
  async checkHealth(): Promise<ApiResponse<string>> {
    try {
      const response = await fetch(`${this.baseUrl}/test/health`);
      if (!response.ok) throw new Error('Health check failed');
      return { message: 'Backend is healthy' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Contact CRUD operations
  async getContacts(): Promise<ApiResponse<ApiContact[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts`);
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAllContacts(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const apiContacts = data.data || data;
      return apiContacts.map((contact: ApiContact) => mapApiContactToContact(contact));
    } catch (error) {
      throw error;
    }
  }

  async createContact(contact: Omit<ApiContact, 'id'>): Promise<ApiResponse<ApiContact>> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create contact');
      }
      const data = await response.json();
      return { data, message: 'Contact created successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateContact(id: number, contact: Partial<ApiContact>): Promise<ApiResponse<ApiContact>> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update contact');
      }
      const data = await response.json();
      return { data, message: 'Contact updated successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteContact(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete contact');
      }
      return { message: 'Contact deleted successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Communication operations
  async getCommunications(contactId: number): Promise<ApiResponse<ApiCommunication[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/${contactId}/communications`);
      if (!response.ok) throw new Error('Failed to fetch communications');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async addCommunication(contactId: number, communication: Omit<ApiCommunication, 'id' | 'contactId'>): Promise<ApiResponse<ApiCommunication>> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/${contactId}/communications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(communication)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add communication');
      }
      const data = await response.json();
      return { data, message: 'Communication added successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Statistics
  async getContactStats(): Promise<ApiResponse<ContactStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/stats`);
      if (!response.ok) throw new Error('Failed to fetch contact statistics');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Lead CRUD operations
  async getLeads(): Promise<ApiResponse<ApiLead[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/leads`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getLeadById(id: number): Promise<ApiResponse<ApiLead>> {
    try {
      const response = await fetch(`${this.baseUrl}/leads/${id}`);
      if (!response.ok) throw new Error('Failed to fetch lead');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createLead(lead: Omit<ApiLead, 'id'>): Promise<ApiResponse<ApiLead>> {
    try {
      const { contactId, ...leadData } = lead;
      if (!contactId) {
        return { error: 'Contact ID is required for lead creation' };
      }

      const response = await fetch(`${this.baseUrl}/leads/contact/${contactId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { error: `HTTP ${response.status}: ${errorText}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async updateLead(id: number, lead: Partial<ApiLead>): Promise<ApiResponse<ApiLead>> {
    try {
      const { contactId, ...leadData } = lead;
      const response = await fetch(`${this.baseUrl}/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        return { error: `HTTP ${response.status}: ${errorText}` };
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async deleteLead(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/leads/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete lead');
      }
      return { message: 'Lead deleted successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getLeadsByStage(stage: string): Promise<ApiResponse<ApiLead[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/leads/stage/${stage}`);
      if (!response.ok) throw new Error('Failed to fetch leads by stage');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getLeadStats(): Promise<ApiResponse<LeadStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/leads/analytics`);
      if (!response.ok) throw new Error('Failed to fetch lead statistics');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Quote CRUD operations
  async getQuotes(): Promise<ApiResponse<ApiQuote[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes`);
      if (!response.ok) throw new Error('Failed to fetch quotes');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getQuoteById(id: number): Promise<ApiResponse<ApiQuote>> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createQuote(quote: Omit<ApiQuote, 'id'>): Promise<ApiResponse<ApiQuote>> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create quote');
      }
      const data = await response.json();
      return { data, message: 'Quote created successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateQuote(id: number, quote: Partial<ApiQuote>): Promise<ApiResponse<ApiQuote>> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quote');
      }
      const data = await response.json();
      return { data, message: 'Quote updated successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteQuote(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete quote');
      }
      return { message: 'Quote deleted successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getQuoteStats(): Promise<ApiResponse<QuoteStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes/analytics`);
      if (!response.ok) throw new Error('Failed to fetch quote statistics');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Quote Items operations
  async addQuoteItem(quoteId: number, item: Omit<ApiQuoteItem, 'id'>): Promise<ApiResponse<ApiQuoteItem>> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes/${quoteId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add quote item');
      }
      const data = await response.json();
      return { data, message: 'Quote item added successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateQuoteItem(quoteId: number, itemId: number, item: Partial<ApiQuoteItem>): Promise<ApiResponse<ApiQuoteItem>> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes/${quoteId}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quote item');
      }
      const data = await response.json();
      return { data, message: 'Quote item updated successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteQuoteItem(quoteId: number, itemId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes/${quoteId}/items/${itemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete quote item');
      }
      return { message: 'Quote item deleted successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Enhanced communication operations
  async getAllCommunications(): Promise<ApiResponse<ApiCommunication[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/communications`);
      if (!response.ok) throw new Error('Failed to fetch communications');
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateCommunication(id: number, communication: Partial<ApiCommunication>): Promise<ApiResponse<ApiCommunication>> {
    try {
      const response = await fetch(`${this.baseUrl}/communications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(communication)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update communication');
      }
      const data = await response.json();
      return { data, message: 'Communication updated successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteCommunication(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/communications/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete communication');
      }
      return { message: 'Communication deleted successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Utility methods for error handling and loading states
  async withErrorHandling<T>(operation: () => Promise<T>, fallback?: T): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    }
  }

  // Batch operations for better performance
  async batchCreateContacts(contacts: Omit<ApiContact, 'id'>[]): Promise<ApiResponse<ApiContact[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacts)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create contacts');
      }
      const data = await response.json();
      return { data, message: 'Contacts created successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}