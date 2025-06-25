'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  Target,
  ArrowRight
} from 'lucide-react';
import { Lead, Contact } from '@/types/crm';
import { ApiCrmService, ApiLead } from './api-crm-service';
import { LeadStage } from '@/constants/crm';

export function LeadPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    value: '',
    probability: '50',
    expectedCloseDate: '',
    assignedTo: '',
    notes: ''
  });

  const apiCrmService: any = ApiCrmService.getInstance();

  const pipelineStages = [
    { name: LeadStage.PROSPECT, displayName: 'Prospect', color: 'bg-gray-500', probability: 10 },
    { name: LeadStage.QUALIFIED, displayName: 'Qualified', color: 'bg-blue-500', probability: 50 },
    { name: LeadStage.PROPOSAL, displayName: 'Proposal', color: 'bg-orange-500', probability: 75 },
    { name: LeadStage.NEGOTIATION, displayName: 'Negotiation', color: 'bg-purple-500', probability: 90 },
    { name: LeadStage.CLOSED_WON, displayName: 'Closed Won', color: 'bg-green-500', probability: 100 },
    { name: LeadStage.CLOSED_LOST, displayName: 'Closed Lost', color: 'bg-red-500', probability: 0 }
  ];

  useEffect(() => {
    const initializeComponent = async () => {
      await checkBackendHealth();
      await loadLeads();
    };
    initializeComponent();
  }, []);

  const checkBackendHealth = async () => {
    const healthResult = await apiCrmService.checkHealth();
    setBackendHealthy(!healthResult.error);
    if (healthResult.error) {
      toast.error('Backend connection failed - please check server status');
    }
  };

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const response = await apiCrmService.getLeads();
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        const mappedLeads = response.data.map(mapApiLeadToLead);
        setLeads(mappedLeads);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      toast.error(`Failed to load leads: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mapping functions between API and UI types
  const mapApiLeadToLead = (apiLead: ApiLead): Lead => {
    return {
      id: apiLead.id?.toString() || '',
      title: apiLead.title,
      contactId: apiLead.contactId?.toString() || '',
      company: '', // Will be populated from contact relationship
      source: apiLead.source || '',
      stage: apiLead.stage,
      status: mapApiStageToStatus(apiLead.stage),
      value: apiLead.value,
      probability: apiLead.probability,
      expectedCloseDate: apiLead.expectedCloseDate ? apiLead.expectedCloseDate.split('T')[0] : '',
      assignedTo: apiLead.assignedUserId?.toString() || '',
      notes: apiLead.notes || '',
      createdAt: apiLead.createdAt || new Date().toISOString(),
      updatedAt: apiLead.updatedAt || new Date().toISOString()
    };
  };

  const mapLeadToApiLead = (lead: Lead): Omit<ApiLead, 'id'> => {
    return {
      title: lead.title,
      description: lead.notes,
      value: lead.value,
      stage: mapStatusToApiStage(lead.status),
      probability: lead.probability,
      expectedCloseDate: lead.expectedCloseDate,
      source: lead.source,
      notes: lead.notes,
      contactId: parseInt(lead.contactId)
    };
  };

  const mapApiStageToStatus = (stage: string): Lead['status'] => {
    switch (stage) {
      case LeadStage.PROSPECT: return 'New';
      case LeadStage.QUALIFIED: return 'Qualified';
      case LeadStage.PROPOSAL: return 'Proposal';
      case LeadStage.NEGOTIATION: return 'Negotiation';
      case LeadStage.CLOSED_WON: return 'Closed Won';
      case LeadStage.CLOSED_LOST: return 'Closed Lost';
      default: return 'New';
    }
  };

  const mapStatusToApiStage = (status: Lead['status']): ApiLead['stage'] => {
    switch (status) {
      case 'New': return 'PROSPECT';
      case 'Qualified': return 'QUALIFIED';
      case 'Proposal': return 'PROPOSAL';
      case 'Negotiation': return 'NEGOTIATION';
      case 'Closed Won': return 'CLOSED_WON';
      case 'Closed Lost': return 'CLOSED_LOST';
      default: return 'PROSPECT';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.company || !formData.email) {
      toast.error('Name, company, and email are required');
      return;
    }

    setIsLoading(true);

    try {
      if (backendHealthy) {
        if (selectedLead) {
          // Update existing lead
          const leadData = {
            title: formData.name,
            description: formData.notes,
            value: parseFloat(formData.value) || 0,
            stage: 'PROSPECT' as ApiLead['stage'],
            probability: parseInt(formData.probability),
            expectedCloseDate: formData.expectedCloseDate ? `${formData.expectedCloseDate}T00:00:00` : undefined,
            source: formData.source,
            notes: formData.notes
          };
          const response = await apiCrmService.updateLead(parseInt(selectedLead.id), leadData);
          if (response.error) {
            throw new Error(response.error);
          }
          toast.success('Lead updated successfully');
        } else {
          // First, create or find a contact
          let contactId: number;
          
          // Try to find existing contact by email
          const contactsResponse = await apiCrmService.getContacts();
          if (contactsResponse.error) {
            throw new Error('Failed to fetch contacts');
          }
          
          const existingContact = contactsResponse.data?.find((c: any) => c.email === formData.email);
          
          if (existingContact) {
            contactId = existingContact.id!;
          } else {
            // Create new contact
            const newContact = {
              name: formData.name,
              email: formData.email,
              phone: formData.phone || '',
              company: formData.company,
              category: 'PROSPECT' as const,
              status: 'ACTIVE' as const
            };
            
            const contactResponse = await apiCrmService.createContact(newContact);
            if (contactResponse.error || !contactResponse.data) {
              throw new Error('Failed to create contact');
            }
            contactId = contactResponse.data.id!;
          }
          
          // Now create the lead with the contact
          const leadData = {
            title: formData.name,
            description: formData.notes,
            value: parseFloat(formData.value) || 0,
            stage: 'PROSPECT' as ApiLead['stage'],
            probability: parseInt(formData.probability),
            expectedCloseDate: formData.expectedCloseDate ? `${formData.expectedCloseDate}T00:00:00` : undefined,
            source: formData.source,
            notes: formData.notes,
            contactId: contactId
          };
          
          const response = await apiCrmService.createLead(leadData);
          if (response.error) {
            throw new Error(response.error);
          }
          toast.success('Lead created successfully');
        }
      } else {
        // Fallback to local storage
        const localLeadData = {
          ...formData,
          value: parseFloat(formData.value) || 0,
          probability: parseInt(formData.probability),
          status: 'New' as Lead['status']
        };
        
        // Backend is not healthy - cannot save lead
        toast.error('Backend connection failed - cannot save lead');
        return;
      }
      
      await loadLeads();
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to save lead: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', company: '', source: '',
      value: '', probability: '50', expectedCloseDate: '', assignedTo: '', notes: ''
    });
    setSelectedLead(null);
  };

  const mapStatusToStage = (status: Lead['status']): string => {
    switch (status) {
      case 'New': return LeadStage.PROSPECT;
      case 'Qualified': return LeadStage.QUALIFIED;
      case 'Proposal': return LeadStage.PROPOSAL;
      case 'Negotiation': return LeadStage.NEGOTIATION;
      case 'Closed Won': return LeadStage.CLOSED_WON;
      case 'Closed Lost': return LeadStage.CLOSED_LOST;
      default: return LeadStage.PROSPECT;
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    const stageValue = mapStatusToStage(newStatus);
    const stage = pipelineStages.find(s => s.name === stageValue);
    if (!stage) return;

    try {
      setIsLoading(true);
      const leadToUpdate = leads.find(l => l.id === leadId);
      if (!leadToUpdate) return;

      const updatedLead = {
        ...leadToUpdate,
        status: newStatus,
        probability: stage.probability,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (backendHealthy) {
        // Map to API format
        const apiLead: ApiLead = {
          id: parseInt(updatedLead.id),
          title: updatedLead.title,
          contactId: parseInt(updatedLead.contactId),
          value: updatedLead.value,
          stage: mapStatusToApiStage(updatedLead.status),
          probability: updatedLead.probability,
          expectedCloseDate: updatedLead.expectedCloseDate ? `${updatedLead.expectedCloseDate}T00:00:00` : undefined,
          source: updatedLead.source,
          notes: updatedLead.notes
        };

        await apiCrmService.updateLead(apiLead.id, apiLead);
      }

      const updatedLeads = leads.map(lead => 
        lead.id === leadId ? updatedLead : lead
      );
      
      // Update local state
      setLeads(updatedLeads);
      toast.success(`Lead moved to ${newStatus}`);
    } catch (error) {
      toast.error(`Failed to update lead status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const editLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.title,
      email: '', // Will be fetched from contact
      phone: '', // Will be fetched from contact,
      company: lead.company,
      source: lead.source,
      value: lead.value.toString(),
      probability: lead.probability.toString(),
      expectedCloseDate: lead.expectedCloseDate,
      assignedTo: lead.assignedTo,
      notes: lead.notes
    });
    setOpen(true);
  };

  const getLeadsByStage = (stage: string) => {
    return leads.filter(lead => lead.status === stage);
  };

  const getTotalPipelineValue = () => {
    return leads.reduce((sum, lead) => sum + (lead.value * lead.probability / 100), 0);
  };

  const getStageValue = (stage: string) => {
    const stageLeads = getLeadsByStage(stage);
    return stageLeads.reduce((sum, lead) => sum + lead.value, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-orange-500" />
            Sales Pipeline
          </h2>
          <p className="text-gray-600">Track leads through your sales process</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedLead ? 'Edit Lead' : 'Add New Lead'}
              </DialogTitle>
              <DialogDescription>
                {selectedLead ? 'Update lead information' : 'Create a new lead in your pipeline'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Contact Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter contact name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">Deal Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Enter deal value"
                  />
                </div>
                <div>
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  />
                </div>
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
              </div>

              <div>
                <Label htmlFor="source">Lead Source</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead source" />
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

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  {selectedLead ? 'Update Lead' : 'Create Lead'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900">${getTotalPipelineValue().toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                <p className="text-3xl font-bold text-gray-900">{leads.filter(l => !['Closed Won', 'Closed Lost'].includes(l.status)).length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {leads.length > 0 ? Math.round((leads.filter(l => l.status === 'Closed Won').length / leads.length) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {pipelineStages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.name);
          const stageValue = getStageValue(stage.name);
          
          return (
            <Card key={stage.name} className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{stage.displayName}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {stageLeads.length}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  ${stageValue.toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => editLead(lead)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900">{lead.title}</h4>
                        <div className="flex space-x-1">
                          {stage.name !== LeadStage.CLOSED_WON && stage.name !== LeadStage.CLOSED_LOST && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = pipelineStages.findIndex(s => s.name === stage.name);
                                if (currentIndex < pipelineStages.length - 3) { // Exclude Closed Won/Lost from auto-progression
                                  updateLeadStatus(lead.id, pipelineStages[currentIndex + 1].name as Lead['status']);
                                }
                              }}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{lead.company}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-green-600">
                          ${lead.value.toLocaleString()}
                        </span>
                        <span className="text-gray-500">
                          {lead.probability}%
                        </span>
                      </div>
                      <Progress value={lead.probability} className="h-1 mt-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {lead.assignedTo}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {lead.expectedCloseDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}