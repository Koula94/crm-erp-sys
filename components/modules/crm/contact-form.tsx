'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, X, User, Building, Mail, Phone, MapPin, Tag } from 'lucide-react';
import { Contact } from '@/types/crm';
import { ApiCrmService, ApiContact } from './api-crm-service';
import { ContactCategory, ContactStatus } from '@/constants/crm';

interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: Contact) => void;
  onCancel: () => void;
  trigger?: React.ReactNode;
}

export function ContactForm({ contact, onSave, onCancel, trigger }: ContactFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    position: contact?.position || '',
    address: contact?.address || '',
    category: contact?.category || 'Prospect',
    status: contact?.status || 'Prospect',
    assignedTo: contact?.assignedTo || '',
    source: contact?.source || '',
    notes: contact?.notes || '',
    linkedin: contact?.socialMedia?.linkedin || '',
    twitter: contact?.socialMedia?.twitter || '',
    facebook: contact?.socialMedia?.facebook || ''
  });
  const [tags, setTags] = useState<string[]>(contact?.tags || []);
  const [newTag, setNewTag] = useState('');

  const apiCrmService: any = new ApiCrmService();

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await apiCrmService.checkHealth();
      setBackendHealthy(true);
    } catch (error) {
      setBackendHealthy(false);
      toast.error('Backend connection failed - please check server status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setIsLoading(true);
      
      const contactData = {
        ...formData,
        tags,
        socialMedia: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          facebook: formData.facebook
        }
      };

      if (!backendHealthy) {
        toast.error('Backend connection failed - cannot save contact');
        return;
      }
      
      let savedContact: Contact;
      
      if (contact) {
        // Update existing contact
        const apiContact: ApiContact = {
          id: parseInt(contact.id),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          address: formData.address,
          category: formData.category as ContactCategory,
        status: formData.status as ContactStatus,
          assignedTo: formData.assignedTo,
          source: formData.source,
          notes: formData.notes,
          tags: tags,
          socialMedia: {
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            facebook: formData.facebook
          },
          createdAt: contact.createdAt,
          updatedAt: new Date().toISOString()
        };
        
        const updateResponse = await apiCrmService.updateContact(apiContact.id, apiContact);
        if (updateResponse.error) {
          throw new Error(updateResponse.error);
        }
        const updatedApiContact = updateResponse.data!;
        savedContact = {
          id: updatedApiContact.id?.toString() || contact.id,
          name: updatedApiContact.name,
          email: updatedApiContact.email,
          phone: updatedApiContact.phone,
          company: updatedApiContact.company,
          position: updatedApiContact.position,
          address: updatedApiContact.address,
          category: updatedApiContact.category,
          status: updatedApiContact.status,
          assignedTo: updatedApiContact.assignedTo,
          source: updatedApiContact.source,
          notes: updatedApiContact.notes,
          tags: updatedApiContact.tags || tags,
          socialMedia: updatedApiContact.socialMedia || {
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            facebook: formData.facebook
          },
          createdAt: updatedApiContact.createdAt,
          updatedAt: updatedApiContact.updatedAt
        };
      } else {
        // Create new contact
        const newApiContact: Omit<ApiContact, 'id' | 'createdAt' | 'updatedAt'> = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          address: formData.address,
          category: formData.category as ContactCategory,
        status: formData.status as ContactStatus,
          assignedTo: formData.assignedTo,
          source: formData.source,
          notes: formData.notes,
          tags: tags,
          socialMedia: {
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            facebook: formData.facebook
          }
        };
        
        const createResponse = await apiCrmService.createContact(newApiContact);
        if (createResponse.error) {
          throw new Error(createResponse.error);
        }
        const createdApiContact = createResponse.data!;
        savedContact = {
          id: createdApiContact.id?.toString() || Date.now().toString(),
          name: createdApiContact.name,
          email: createdApiContact.email,
          phone: createdApiContact.phone,
          company: createdApiContact.company,
          position: createdApiContact.position,
          address: createdApiContact.address,
          category: createdApiContact.category,
          status: createdApiContact.status,
          assignedTo: createdApiContact.assignedTo,
          source: createdApiContact.source,
          notes: createdApiContact.notes,
          tags: createdApiContact.tags || tags,
          socialMedia: createdApiContact.socialMedia || {
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            facebook: formData.facebook
          },
          createdAt: createdApiContact.createdAt,
          updatedAt: createdApiContact.updatedAt
        };
      }
      
      onSave(savedContact);
      setOpen(false);
      toast.success(contact ? 'Contact updated successfully' : 'Contact created successfully');
      
      // Reset form if creating new contact
      if (!contact) {
        setFormData({
          name: '', email: '', phone: '', company: '', position: '', address: '',
          category: 'Prospect', status: 'Prospect', assignedTo: '', source: '', notes: '',
          linkedin: '', twitter: '', facebook: ''
        });
        setTags([]);
      }
    } catch (error) {
      toast.error(`Failed to save contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </DialogTitle>
          <DialogDescription>
            {contact ? 'Update contact information and details' : 'Create a new contact in your CRM system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter address"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Enter job position"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ContactCategory.CLIENT}>Client</SelectItem>
                      <SelectItem value={ContactCategory.PROSPECT}>Prospect</SelectItem>
                      <SelectItem value={ContactCategory.PARTNER}>Partner</SelectItem>
                      <SelectItem value={ContactCategory.VENDOR}>Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ContactStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={ContactStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={ContactStatus.PROSPECT}>Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assignment & Source</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      <SelectItem value="Carlos Mendez">Carlos Mendez</SelectItem>
                      <SelectItem value="Ana Torres">Ana Torres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Cold Call">Cold Call</SelectItem>
                      <SelectItem value="Trade Show">Trade Show</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Advertisement">Advertisement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags & Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add tag"
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="LinkedIn profile URL"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes about this contact..."
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              {contact ? 'Update Contact' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}