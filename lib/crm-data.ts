// CRM Data Management Service
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  address: string;
  category: 'Client' | 'Prospect' | 'Partner' | 'Vendor';
  tags: string[];
  status: 'Active' | 'Inactive' | 'Prospect';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  source: string;
  notes: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  customFields?: Record<string, any>;
}

export interface Communication {
  id: string;
  contactId: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Note' | 'Task';
  subject: string;
  content: string;
  date: string;
  time: string;
  duration?: number; // in minutes
  outcome?: string;
  nextAction?: string;
  createdBy: string;
  attachments?: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  activities: Communication[];
}

export interface Quote {
  id: string;
  number: string;
  contactId: string;
  leadId?: string;
  title: string;
  description: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  terms: string;
  notes: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  isDefault: boolean;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  color: string;
}

// Mock data for testing
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+1 234-567-8901',
    company: 'Rodriguez Family',
    position: 'Homeowner',
    address: '123 Downtown District, City',
    category: 'Client',
    tags: ['VIP', 'Residential'],
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    assignedTo: 'John Doe',
    source: 'Referral',
    notes: 'Looking for villa construction project',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/carlosrodriguez'
    }
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@techcorp.com',
    phone: '+1 234-567-8902',
    company: 'Tech Corp SA',
    position: 'Facilities Manager',
    address: '456 Business District, City',
    category: 'Client',
    tags: ['Commercial', 'Large Project'],
    status: 'Active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-22',
    assignedTo: 'Jane Smith',
    source: 'Website',
    notes: 'Office building renovation project'
  },
  {
    id: '3',
    name: 'Luis Mendoza',
    email: 'luis@urbandevelopers.com',
    phone: '+1 234-567-8903',
    company: 'Urban Developers',
    position: 'Project Director',
    address: '789 North Zone, City',
    category: 'Prospect',
    tags: ['Developer', 'Multi-unit'],
    status: 'Prospect',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-22',
    assignedTo: 'John Doe',
    source: 'Cold Call',
    notes: 'Interested in residential complex development'
  }
];

export const mockCommunications: Communication[] = [
  {
    id: '1',
    contactId: '1',
    type: 'Call',
    subject: 'Initial consultation call',
    content: 'Discussed project requirements and timeline. Client is interested in modern villa design.',
    date: '2024-01-20',
    time: '10:30 AM',
    duration: 45,
    outcome: 'Positive - scheduled site visit',
    nextAction: 'Send project proposal',
    createdBy: 'John Doe'
  },
  {
    id: '2',
    contactId: '1',
    type: 'Email',
    subject: 'Project proposal sent',
    content: 'Sent detailed proposal for villa construction including timeline and budget.',
    date: '2024-01-21',
    time: '2:15 PM',
    createdBy: 'John Doe'
  },
  {
    id: '3',
    contactId: '2',
    type: 'Meeting',
    subject: 'Site inspection meeting',
    content: 'Met at the office building to assess renovation requirements.',
    date: '2024-01-19',
    time: '9:00 AM',
    duration: 120,
    outcome: 'Approved preliminary design',
    nextAction: 'Prepare detailed quote',
    createdBy: 'Jane Smith'
  }
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Ana Gutierrez',
    email: 'ana.gutierrez@email.com',
    phone: '+1 234-567-8904',
    company: 'Gutierrez Enterprises',
    source: 'Trade Show',
    status: 'Qualified',
    value: 125000,
    probability: 70,
    expectedCloseDate: '2024-03-15',
    assignedTo: 'John Doe',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-22',
    notes: 'Interested in warehouse construction project',
    activities: []
  },
  {
    id: '2',
    name: 'Roberto Silva',
    email: 'roberto@silvagroup.com',
    phone: '+1 234-567-8905',
    company: 'Silva Group',
    source: 'Website',
    status: 'Proposal',
    value: 89000,
    probability: 85,
    expectedCloseDate: '2024-02-28',
    assignedTo: 'Jane Smith',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-21',
    notes: 'Retail space renovation project',
    activities: []
  }
];

export const mockQuotes: Quote[] = [
  {
    id: '1',
    number: 'Q-2024-001',
    contactId: '1',
    title: 'Villa Construction - Downtown',
    description: 'Complete villa construction including foundation, structure, and finishing',
    items: [
      {
        id: '1',
        description: 'Foundation and structural work',
        quantity: 1,
        unitPrice: 35000,
        total: 35000,
        category: 'Construction'
      },
      {
        id: '2',
        description: 'Electrical and plumbing installation',
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
        category: 'Installation'
      },
      {
        id: '3',
        description: 'Interior finishing and fixtures',
        quantity: 1,
        unitPrice: 25000,
        total: 25000,
        category: 'Finishing'
      }
    ],
    subtotal: 75000,
    tax: 7500,
    discount: 2500,
    total: 80000,
    status: 'Sent',
    validUntil: '2024-02-15',
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21',
    createdBy: 'John Doe',
    terms: 'Payment terms: 30% upfront, 40% at 50% completion, 30% upon completion',
    notes: 'Quote includes all materials and labor'
  }
];

// CRM Service Functions
export class CRMService {
  private static instance: CRMService;
  
  static getInstance(): CRMService {
    if (!CRMService.instance) {
      CRMService.instance = new CRMService();
    }
    return CRMService.instance;
  }

  // Contact Management
  getContacts(): Contact[] {
    const stored = localStorage.getItem('crm_contacts');
    return stored ? JSON.parse(stored) : mockContacts;
  }

  saveContacts(contacts: Contact[]): void {
    localStorage.setItem('crm_contacts', JSON.stringify(contacts));
  }

  createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const contacts = this.getContacts();
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    contacts.push(newContact);
    this.saveContacts(contacts);
    return newContact;
  }

  updateContact(id: string, updates: Partial<Contact>): Contact | null {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.saveContacts(contacts);
    return contacts[index];
  }

  deleteContact(id: string): boolean {
    const contacts = this.getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    if (filtered.length === contacts.length) return false;
    this.saveContacts(filtered);
    return true;
  }

  searchContacts(query: string): Contact[] {
    const contacts = this.getContacts();
    const lowercaseQuery = query.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company?.toLowerCase().includes(lowercaseQuery) ||
      contact.phone.includes(query)
    );
  }

  filterContacts(filters: {
    category?: string;
    status?: string;
    tags?: string[];
    assignedTo?: string;
  }): Contact[] {
    const contacts = this.getContacts();
    return contacts.filter(contact => {
      if (filters.category && contact.category !== filters.category) return false;
      if (filters.status && contact.status !== filters.status) return false;
      if (filters.assignedTo && contact.assignedTo !== filters.assignedTo) return false;
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => contact.tags.includes(tag));
        if (!hasTag) return false;
      }
      return true;
    });
  }

  // Communication Management
  getCommunications(contactId?: string): Communication[] {
    const stored = localStorage.getItem('crm_communications');
    const communications = stored ? JSON.parse(stored) : mockCommunications;
    return contactId ? communications.filter(c => c.contactId === contactId) : communications;
  }

  saveCommunications(communications: Communication[]): void {
    localStorage.setItem('crm_communications', JSON.stringify(communications));
  }

  addCommunication(communication: Omit<Communication, 'id'>): Communication {
    const communications = this.getCommunications();
    const newCommunication: Communication = {
      ...communication,
      id: Date.now().toString()
    };
    communications.push(newCommunication);
    this.saveCommunications(communications);
    return newCommunication;
  }

  // Lead Management
  getLeads(): Lead[] {
    const stored = localStorage.getItem('crm_leads');
    return stored ? JSON.parse(stored) : mockLeads;
  }

  saveLeads(leads: Lead[]): void {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }

  createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'activities'>): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      activities: []
    };
    leads.push(newLead);
    this.saveLeads(leads);
    return newLead;
  }

  updateLeadStatus(id: string, status: Lead['status']): Lead | null {
    const leads = this.getLeads();
    const index = leads.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    leads[index] = {
      ...leads[index],
      status,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.saveLeads(leads);
    return leads[index];
  }

  // Quote Management
  getQuotes(): Quote[] {
    const stored = localStorage.getItem('crm_quotes');
    return stored ? JSON.parse(stored) : mockQuotes;
  }

  saveQuotes(quotes: Quote[]): void {
    localStorage.setItem('crm_quotes', JSON.stringify(quotes));
  }

  createQuote(quote: Omit<Quote, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Quote {
    const quotes = this.getQuotes();
    const quoteNumber = `Q-${new Date().getFullYear()}-${(quotes.length + 1).toString().padStart(3, '0')}`;
    const newQuote: Quote = {
      ...quote,
      id: Date.now().toString(),
      number: quoteNumber,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    quotes.push(newQuote);
    this.saveQuotes(quotes);
    return newQuote;
  }

  // Analytics and Reporting
  getAnalytics() {
    const contacts = this.getContacts();
    const leads = this.getLeads();
    const quotes = this.getQuotes();
    const communications = this.getCommunications();

    return {
      totalContacts: contacts.length,
      activeContacts: contacts.filter(c => c.status === 'Active').length,
      prospects: contacts.filter(c => c.status === 'Prospect').length,
      totalLeads: leads.length,
      qualifiedLeads: leads.filter(l => l.status === 'Qualified').length,
      totalQuotes: quotes.length,
      sentQuotes: quotes.filter(q => q.status === 'Sent').length,
      acceptedQuotes: quotes.filter(q => q.status === 'Accepted').length,
      totalCommunications: communications.length,
      recentCommunications: communications.filter(c => {
        const commDate = new Date(c.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return commDate >= weekAgo;
      }).length,
      pipelineValue: leads.reduce((sum, lead) => sum + (lead.value * lead.probability / 100), 0),
      quoteValue: quotes.reduce((sum, quote) => sum + quote.total, 0)
    };
  }

  // Export/Import functionality
  exportContacts(): string {
    const contacts = this.getContacts();
    return JSON.stringify(contacts, null, 2);
  }

  importContacts(jsonData: string): boolean {
    try {
      const contacts = JSON.parse(jsonData);
      if (Array.isArray(contacts)) {
        this.saveContacts(contacts);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}