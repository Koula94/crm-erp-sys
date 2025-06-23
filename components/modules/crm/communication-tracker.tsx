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
import { toast } from 'sonner';
import { 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  CheckSquare,
  Clock,
  User,
  MessageSquare
} from 'lucide-react';
import { Communication, Contact, CRMService } from '@/lib/crm-data';

interface CommunicationTrackerProps {
  contactId: string;
  contact: Contact;
}

export function CommunicationTracker({ contactId, contact }: CommunicationTrackerProps) {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Call' as Communication['type'],
    subject: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    duration: '',
    outcome: '',
    nextAction: ''
  });

  const crmService = CRMService.getInstance();

  useEffect(() => {
    loadCommunications();
  }, [contactId]);

  const loadCommunications = () => {
    const comms = crmService.getCommunications(contactId);
    setCommunications(comms.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.content) {
      toast.error('Subject and content are required');
      return;
    }

    const communicationData = {
      contactId,
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      createdBy: 'Current User' // In real app, get from auth context
    };

    try {
      crmService.addCommunication(communicationData);
      toast.success('Communication logged successfully');
      loadCommunications();
      setOpen(false);
      
      // Reset form
      setFormData({
        type: 'Call',
        subject: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        duration: '',
        outcome: '',
        nextAction: ''
      });
    } catch (error) {
      toast.error('Failed to log communication');
    }
  };

  const getTypeIcon = (type: Communication['type']) => {
    switch (type) {
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Meeting': return <Calendar className="w-4 h-4" />;
      case 'Note': return <FileText className="w-4 h-4" />;
      case 'Task': return <CheckSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Communication['type']) => {
    switch (type) {
      case 'Call': return 'bg-blue-500';
      case 'Email': return 'bg-green-500';
      case 'Meeting': return 'bg-purple-500';
      case 'Note': return 'bg-gray-500';
      case 'Task': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Communication History
            </CardTitle>
            <CardDescription>
              Track all interactions with {contact.name}
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Log Communication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log New Communication</DialogTitle>
                <DialogDescription>
                  Record a new interaction with {contact.name}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Communication Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as Communication['type'] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Call">Phone Call</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Note">Note</SelectItem>
                        <SelectItem value="Task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Communication subject"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Describe the communication details..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="outcome">Outcome</Label>
                  <Input
                    id="outcome"
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    placeholder="What was the result of this communication?"
                  />
                </div>

                <div>
                  <Label htmlFor="nextAction">Next Action</Label>
                  <Input
                    id="nextAction"
                    value={formData.nextAction}
                    onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                    placeholder="What needs to be done next?"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Log Communication
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {communications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No communications recorded yet</p>
            <p className="text-sm">Start by logging your first interaction</p>
          </div>
        ) : (
          <div className="space-y-4">
            {communications.map((comm) => (
              <div key={comm.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${getTypeColor(comm.type)} flex items-center justify-center text-white`}>
                      {getTypeIcon(comm.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {comm.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {comm.time}
                        </span>
                        {comm.duration && (
                          <span>{comm.duration} min</span>
                        )}
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {comm.createdBy}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{comm.type}</Badge>
                </div>
                
                <div className="ml-11">
                  <p className="text-gray-700 mb-3">{comm.content}</p>
                  
                  {comm.outcome && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-600">Outcome: </span>
                      <span className="text-sm text-gray-700">{comm.outcome}</span>
                    </div>
                  )}
                  
                  {comm.nextAction && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-600">Next Action: </span>
                      <span className="text-sm text-orange-600 font-medium">{comm.nextAction}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}