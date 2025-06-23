'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  Download,
  Filter,
  BarChart3
} from 'lucide-react';
import { CRMService } from '@/lib/crm-data';

export function CRMAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const crmService = CRMService.getInstance();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    const data = crmService.getAnalytics();
    setAnalytics(data);
  };

  const generateSalesData = () => {
    return [
      { month: 'Jan', leads: 45, conversions: 12, revenue: 89000 },
      { month: 'Feb', leads: 52, conversions: 15, revenue: 125000 },
      { month: 'Mar', leads: 38, conversions: 9, revenue: 67000 },
      { month: 'Apr', leads: 61, conversions: 18, revenue: 156000 },
      { month: 'May', leads: 49, conversions: 14, revenue: 98000 },
      { month: 'Jun', leads: 55, conversions: 16, revenue: 134000 }
    ];
  };

  const generateSourceData = () => {
    return [
      { name: 'Website', value: 35, color: '#8884d8' },
      { name: 'Referral', value: 25, color: '#82ca9d' },
      { name: 'Cold Call', value: 20, color: '#ffc658' },
      { name: 'Trade Show', value: 15, color: '#ff7300' },
      { name: 'Social Media', value: 5, color: '#00ff00' }
    ];
  };

  const generateActivityData = () => {
    const contacts = crmService.getContacts();
    const communications = crmService.getCommunications();
    
    return contacts.slice(0, 10).map(contact => ({
      name: contact.name,
      company: contact.company,
      lastContact: communications
        .filter(c => c.contactId === contact.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || 'Never',
      totalInteractions: communications.filter(c => c.contactId === contact.id).length,
      status: contact.status
    }));
  };

  const exportReport = () => {
    const reportData = {
      analytics,
      salesData: generateSalesData(),
      sourceData: generateSourceData(),
      activityData: generateActivityData(),
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  const salesData = generateSalesData();
  const sourceData = generateSourceData();
  const activityData = generateActivityData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-orange-500" />
            CRM Analytics & Reports
          </h2>
          <p className="text-gray-600">Analyze your sales performance and customer data</p>
        </div>
        <div className="flex space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalContacts}</p>
                <p className="text-sm text-green-600 mt-1">
                  {analytics.activeContacts} active
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${analytics.pipelineValue.toLocaleString()}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  {analytics.totalLeads} leads
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quote Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${analytics.quoteValue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {analytics.acceptedQuotes} accepted
                </p>
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
                <p className="text-sm font-medium text-gray-600">Communications</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalCommunications}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {analytics.recentCommunications} this week
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Monthly leads, conversions, and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Distribution of lead sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#ff7300" 
                strokeWidth={3}
                dot={{ fill: '#ff7300', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Report */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Contact Activity Report</CardTitle>
          <CardDescription>Recent contact interactions and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Interactions</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityData.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.lastContact}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{contact.totalInteractions}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={contact.status === 'Active' ? 'default' : 'secondary'}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}