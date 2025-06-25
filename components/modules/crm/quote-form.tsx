'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Edit, 
  DollarSign, 
  FileText, 
  Calendar,
  User,
  Building,
  Save,
  X
} from 'lucide-react';
import { Quote, Contact } from '@/types/crm';
import { ApiCrmService, ApiQuote, ApiQuoteItem } from './api-crm-service';

interface QuoteFormProps {
  quote?: Quote;
  onSave: (quote: Quote) => void;
  onCancel: () => void;
  trigger?: React.ReactNode;
}

interface LocalQuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
}

export function QuoteForm({ quote, onSave, onCancel, trigger }: QuoteFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [items, setItems] = useState<LocalQuoteItem[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    description: '',
    status: 'DRAFT' as ApiQuote['status'],
    validUntil: '',
    terms: '',
    notes: '',
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
  });

  const apiCrmService: any = ApiCrmService.getInstance();

  useEffect(() => {
    const initializeComponent = async () => {
      await checkBackendHealth();
      await loadContacts();
      if (quote) {
        populateForm(quote);
      }
    };
    initializeComponent();
  }, [quote]);

  useEffect(() => {
    calculateTotals();
  }, [items, formData.tax, formData.discount]);

  const checkBackendHealth = async () => {
    try {
      await apiCrmService.checkHealth();
      setBackendHealthy(true);
    } catch (error) {
      setBackendHealthy(false);
      toast.error('Backend connection failed - please check server status');
    }
  };

  const loadContacts = async () => {
    try {
      const response = await apiCrmService.getContacts();
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data && Array.isArray(response.data)) {
        const mappedContacts: Contact[] = response.data.map((apiContact: any) => ({
          id: apiContact.id.toString(),
          name: apiContact.name,
          email: apiContact.email,
          phone: apiContact.phone,
          company: apiContact.company,
          position: apiContact.position,
          address: apiContact.address,
          category: apiContact.category,
          status: apiContact.status,
          assignedTo: apiContact.assignedTo,
          source: apiContact.source,
          notes: apiContact.notes,
          tags: [],
          socialMedia: {},
          createdAt: apiContact.createdAt,
          updatedAt: apiContact.updatedAt
        }));
        setContacts(mappedContacts);
      } else {
        throw new Error('No contact data received');
      }
    } catch (error) {
      setContacts([]);
      toast.error(`Failed to load contacts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const populateForm = (quoteData: Quote) => {
    setFormData({
      title: quoteData.title,
      contactId: quoteData.contactId,
      description: quoteData.description || '',
      status: mapUIStatusToApi(quoteData.status),
      validUntil: quoteData.validUntil,
      terms: quoteData.terms || '',
      notes: quoteData.notes || '',
      subtotal: quoteData.subtotal || 0,
      tax: quoteData.tax || 0,
      discount: quoteData.discount || 0,
      total: quoteData.total
    });
    
    if (quoteData.items) {
      setItems(quoteData.items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        category: item.category
      })));
    }
  };

  const mapUIStatusToApi = (status: string): ApiQuote['status'] => {
    switch (status) {
      case 'Draft': return 'DRAFT';
      case 'Sent': return 'SENT';
      case 'Viewed': return 'VIEWED';
      case 'Accepted': return 'ACCEPTED';
      case 'Rejected': return 'REJECTED';
      case 'Expired': return 'EXPIRED';
      default: return 'DRAFT';
    }
  };

  const mapApiStatusToUI = (status: ApiQuote['status']): Quote['status'] => {
    switch (status) {
      case 'DRAFT': return 'Draft';
      case 'SENT': return 'Sent';
      case 'VIEWED': return 'Sent'; // Map VIEWED to Sent since it's not in Quote status
      case 'ACCEPTED': return 'Accepted';
      case 'REJECTED': return 'Rejected';
      case 'EXPIRED': return 'Expired';
      default: return 'Draft';
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * formData.tax) / 100;
    const discountAmount = (subtotal * formData.discount) / 100;
    const total = subtotal + taxAmount - discountAmount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      total
    }));
  };

  const addItem = () => {
    setItems([...items, {
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      category: ''
    }]);
  };

  const updateItem = (index: number, field: keyof LocalQuoteItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.contactId) {
      toast.error('Title and contact are required');
      return;
    }

    if (items.length === 0) {
      toast.error('At least one item is required');
      return;
    }

    setIsLoading(true);
    
    try {
      const quoteData: Quote = {
        id: quote?.id || '',
        number: quote?.number || `Q-${Date.now()}`,
        title: formData.title,
        contactId: formData.contactId,
        description: formData.description,
        status: mapApiStatusToUI(formData.status),
        validUntil: formData.validUntil,
        terms: formData.terms,
        notes: formData.notes,
        subtotal: formData.subtotal,
        tax: formData.tax,
        discount: formData.discount,
        total: formData.total,
        items: items.map(item => ({
          id: item.id || '',
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          category: item.category || 'General'
        })),
        createdAt: quote?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        createdBy: quote?.createdBy || 'Current User'
      };

      if (backendHealthy) {
        try {
          const apiQuote: ApiQuote = {
            id: quote?.id ? parseInt(quote.id) : undefined,
            quoteNumber: quoteData.number,
            contactId: parseInt(formData.contactId),
            title: formData.title,
            description: formData.description,
            subtotal: formData.subtotal,
            tax: formData.tax,
            discount: formData.discount,
            total: formData.total,
            status: formData.status,
            validUntil: formData.validUntil,
            terms: formData.terms,
            notes: formData.notes,
            items: items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
              category: item.category
            }))
          };

          if (quote?.id) {
            await apiCrmService.updateQuote(parseInt(quote.id), apiQuote);
            toast.success('Quote updated successfully');
          } else {
            await apiCrmService.createQuote(apiQuote);
            toast.success('Quote created successfully');
          }
        } catch (apiError) {
          toast.error(`Failed to save quote: ${apiError instanceof Error ? apiError.message : 'API error'}`);
          return;
        }
      } else {
        toast.error('Backend connection failed - cannot save quote');
        return;
      }

      onSave(quoteData);
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to save quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      contactId: '',
      description: '',
      status: 'DRAFT',
      validUntil: '',
      terms: '',
      notes: '',
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0
    });
    setItems([]);
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Plus className="w-4 h-4 mr-2" />
            {quote ? 'Edit Quote' : 'New Quote'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {quote ? 'Edit Quote' : 'Create New Quote'}
          </DialogTitle>
          <DialogDescription>
            {quote ? 'Update quote information and items' : 'Create a new quote for your client'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quote Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter quote title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Client *</Label>
              <Select value={formData.contactId} onValueChange={(value) => setFormData({ ...formData, contactId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} - {contact.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: ApiQuote['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="VIEWED">Viewed</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter quote description"
              rows={3}
            />
          </div>

          {/* Quote Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Quote Items</CardTitle>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.category || ''}
                          onChange={(e) => updateItem(index, 'category', e.target.value)}
                          placeholder="Category"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${item.total.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No items added yet</p>
                  <p className="text-sm">Click &quot;Add Item&quot; to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quote Totals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax (%)</Label>
                  <Input
                    id="tax"
                    type="number"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <div className="text-2xl font-bold text-green-600 flex items-center">
                    <DollarSign className="w-6 h-6 mr-1" />
                    {formData.total.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({formData.tax}%):</span>
                  <span>${((formData.subtotal * formData.tax) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({formData.discount}%):</span>
                  <span>-${((formData.subtotal * formData.discount) / 100).toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${formData.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                placeholder="Enter terms and conditions"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter internal notes"
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : (quote ? 'Update Quote' : 'Create Quote')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}