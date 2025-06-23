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
import { Lead, CRMService } from '@/lib/crm-data';

export function LeadPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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

  const crmService = CRMService.getInstance();

  const pipelineStages = [
    { name: 'New', color: 'bg-gray-500', probability: 10 },
    { name: 'Contacted', color: 'bg-blue-500', probability: 25 },
    { name: 'Qualified', color: 'bg-yellow-500', probability: 50 },
    { name: 'Proposal', color: 'bg-orange-500', probability: 75 },
    { name: 'Negotiation', color: 'bg-purple-500', probability: 90 },
    { name: 'Closed Won', color: 'bg-green-500', probability: 100 },
    { name: 'Closed Lost', color: 'bg-red-500', probability: 0 }
  ];

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    const allLeads = crmService.getLeads();
    setLeads(allLeads);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.company) {
      toast.error('Name, email, and company are required');
      return;
    }

    const leadData = {
      ...formData,
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability),
      status: 'New' as Lead['status']
    };

    try {
      if (selectedLead) {
        // Update existing lead
        const updatedLeads = leads.map(lead => 
          lead.id === selectedLead.id 
            ? { ...lead, ...leadData, updatedAt: new Date().toISOString().split('T')[0] }
            : lead
        );
        crmService.saveLeads(updatedLeads);
        toast.success('Lead updated successfully');
      } else {
        // Create new lead
        crmService.createLead(leadData as any);
        toast.success('Lead created successfully');
      }
      
      loadLeads();
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save lead');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', company: '', source: '',
      value: '', probability: '50', expectedCloseDate: '', assignedTo: '', notes: ''
    });
    setSelectedLead(null);
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    const stage = pipelineStages.find(s => s.name === newStatus);
    if (stage) {
      const updatedLeads = leads.map(lead => 
        lead.id === leadId 
          ? { 
              ...lead, 
              status: newStatus, 
              probability: stage.probability,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : lead
      );
      crmService.saveLeads(updatedLeads);
      setLeads(updatedLeads);
      toast.success(`Lead moved to ${newStatus}`);
    }
  };

  const editLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
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
                  <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
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
                        <h4 className="font-medium text-sm text-gray-900">{lead.name}</h4>
                        <div className="flex space-x-1">
                          {stage.name !== 'Closed Won' && stage.name !== 'Closed Lost' && (
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