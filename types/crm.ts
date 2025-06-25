export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  category: 'Prospect' | 'Lead' | 'Customer' | 'Partner';
  status: 'Prospect' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Customer' | 'Lost';
  assignedTo: string;
  source: string;
  notes: string;
  tags: string[];
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  number: string;
  contactId: string;
  title: string;
  description: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
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

export interface Communication {
  id: string;
  contactId: string;
  type: 'Email' | 'Phone' | 'Meeting' | 'Note';
  subject: string;
  content: string;
  date: string;
  time: string;
  duration: string;
  outcome: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  title: string;
  contactId: string;
  company: string;
  value: number;
  stage: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}