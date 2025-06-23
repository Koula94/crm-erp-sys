'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  DollarSign,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { Contact, Quote, CRMService } from '@/lib/crm-data';
import { ContactForm } from './contact-form';
import { CommunicationTracker } from './communication-tracker';
import { LeadPipeline } from './lead-pipeline';
import { CRMAnalytics } from './crm-analytics';

export function CRMModule() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showCommunications, setShowCommunications] = useState(false);

  const crmService = CRMService.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setContacts(crmService.getContacts());
    setQuotes(crmService.getQuotes());
  };

  const handleContactSave = (contact: Contact) => {
    loadData();
  };

  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      if (crmService.deleteContact(contactId)) {
        toast.success('Contact deleted successfully');
        loadData();
      } else {
        toast.error('Failed to delete contact');
      }
    }
  };

  const handleExportContacts = () => {
    const exportData = crmService.exportContacts();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Contacts exported successfully');
  };

  const handleImportContacts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (crmService.importContacts(content)) {
            toast.success('Contacts imported successfully');
            loadData();
          } else {
            toast.error('Failed to import contacts - invalid format');
          }
        } catch (error) {
          toast.error('Failed to import contacts');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchQuery || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || contact.category === filterCategory;
    const matchesStatus = !filterStatus || contact.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Prospect': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Client': return 'default';
      case 'Prospect': return 'secondary';
      case 'Partner': return 'outline';
      case 'Vendor': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-orange-500" />
            CRM Module
          </h1>
          <p className="text-gray-600 mt-2">Manage your clients, leads, and customer relationships</p>
        </div>
        <ContactForm onSave={handleContactSave} onCancel={() => {}} />
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contact Management</CardTitle>
                  <CardDescription>Manage your client relationships and contact information</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleExportContacts}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <label htmlFor="import-contacts">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Import
                        </span>
                      </Button>
                    </label>
                    <input
                      id="import-contacts"
                      type="file"
                      accept=".json"
                      onChange={handleImportContacts}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              
              {/* Search and Filters */}
              <div className="flex items-center space-x-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={`/avatars/contact-${contact.id}.png`} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.position}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contact.company}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {contact.address}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            {contact.email}
                          </p>
                          <p className="text-sm flex items-center">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            {contact.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getCategoryColor(contact.category)}>
                          {contact.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{contact.assignedTo}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedContact(contact);
                              setShowCommunications(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <ContactForm 
                            contact={contact}
                            onSave={handleContactSave}
                            onCancel={() => {}}
                            trigger={
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            }
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredContacts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No contacts found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <LeadPipeline />
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Quote Management
                  </CardTitle>
                  <CardDescription>Create and manage project quotes for your clients</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Quote
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id} className="hover:bg-gray-50">
                      <TableCell>
                        <span className="font-mono text-sm">{quote.number}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {contacts.find(c => c.id === quote.contactId)?.name || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{quote.title}</div>
                        <div className="text-sm text-gray-500">Created: {quote.createdAt}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-lg flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                          {quote.total.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            quote.status === 'Accepted' ? 'default' : 
                            quote.status === 'Sent' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{quote.validUntil}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <CRMAnalytics />
        </TabsContent>
      </Tabs>

      {/* Communication Tracker Dialog */}
      <Dialog open={showCommunications} onOpenChange={setShowCommunications}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Communication History</DialogTitle>
            <DialogDescription>
              {selectedContact && `Track all interactions with ${selectedContact.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <CommunicationTracker 
              contactId={selectedContact.id} 
              contact={selectedContact}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}