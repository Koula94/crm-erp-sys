'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DollarSign, 
  Plus, 
  Search, 
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  CreditCard,
  Wallet
} from 'lucide-react';

const invoices = [
  {
    id: 1,
    number: 'INV-2024-001',
    client: 'Rodriguez Family',
    project: 'Villa Construction Downtown',
    amount: '$15,500',
    issueDate: '2024-01-15',
    dueDate: '2024-02-14',
    status: 'Paid',
    paymentDate: '2024-01-28'
  },
  {
    id: 2,
    number: 'INV-2024-002',
    client: 'Tech Corp SA',
    project: 'Office Building Renovation',
    amount: '$32,800',
    issueDate: '2024-01-18',
    dueDate: '2024-02-17',
    status: 'Pending',
    paymentDate: null
  },
  {
    id: 3,
    number: 'INV-2024-003',
    client: 'Urban Developers',
    project: 'Residential Complex Phase 2',
    amount: '$48,200',
    issueDate: '2024-01-20',
    dueDate: '2024-02-19',
    status: 'Overdue',
    paymentDate: null
  }
];

const expenses = [
  {
    id: 1,
    description: 'Steel Rebar Purchase',
    category: 'Materials',
    amount: '$8,500',
    date: '2024-01-15',
    vendor: 'Steel Suppliers Ltd',
    project: 'Villa Construction Downtown',
    status: 'Paid',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 2,
    description: 'Equipment Rental - Excavator',
    category: 'Equipment',
    amount: '$2,400',
    date: '2024-01-18',
    vendor: 'Heavy Equipment Rentals',
    project: 'Residential Complex Phase 2',
    status: 'Pending',
    paymentMethod: 'Credit Card'
  },
  {
    id: 3,
    description: 'Concrete Delivery',
    category: 'Materials',
    amount: '$3,200',
    date: '2024-01-20',
    vendor: 'Concrete Solutions Inc',
    project: 'Office Building Renovation',
    status: 'Approved',
    paymentMethod: 'Check'
  }
];

const cashFlow = [
  {
    month: 'January 2024',
    income: '$156,500',
    expenses: '$89,200',
    netFlow: '$67,300',
    trend: 'up'
  },
  {
    month: 'December 2023',
    income: '$142,300',
    expenses: '$95,800',
    netFlow: '$46,500',
    trend: 'up'
  },
  {
    month: 'November 2023',
    income: '$134,800',
    expenses: '$88,400',
    netFlow: '$46,400',
    trend: 'down'
  }
];

const budgets = [
  {
    id: 1,
    project: 'Villa Construction Downtown',
    totalBudget: '$89,500',
    spent: '$58,200',
    remaining: '$31,300',
    percentage: 65
  },
  {
    id: 2,
    project: 'Office Building Renovation',
    totalBudget: '$156,000',
    spent: '$39,000',
    remaining: '$117,000',
    percentage: 25
  },
  {
    id: 3,
    project: 'Residential Complex Phase 2',
    totalBudget: '$245,000',
    spent: '$208,250',
    remaining: '$36,750',
    percentage: 85
  }
];

export function FinanceModule() {
  const [searchQuery, setSearchQuery] = useState('');

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Overdue': return 'destructive';
      case 'Draft': return 'outline';
      default: return 'outline';
    }
  };

  const getExpenseStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Approved': return 'outline';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-8 h-8 mr-3 text-orange-500" />
            Finance Module
          </h1>
          <p className="text-gray-600 mt-2">Manage invoices, expenses, and financial tracking</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="dashboard-grid">
        <Card className="border-0 shadow-md card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$156,500</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$89,200</p>
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  +7% from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Cash Flow</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$67,300</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +18% from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Invoices</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$81,000</p>
                <p className="text-sm text-orange-600 mt-1">
                  5 pending invoices
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Invoice Management
                  </CardTitle>
                  <CardDescription>Create and track customer invoices</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-mono text-sm font-medium">{invoice.number}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{invoice.client}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{invoice.project}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-lg text-green-600">{invoice.amount}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{invoice.issueDate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {invoice.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getInvoiceStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            PDF
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

        <TabsContent value="expenses" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Expense Management
                  </CardTitle>
                  <CardDescription>Track and manage business expenses</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{expense.description}</div>
                        <div className="text-sm text-gray-500">{expense.paymentMethod}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-lg text-red-600">{expense.amount}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{expense.date}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{expense.vendor}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{expense.project}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getExpenseStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
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

        <TabsContent value="cashflow" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Cash Flow Analysis
              </CardTitle>
              <CardDescription>Monitor your company's cash flow trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cashFlow.map((period, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{period.month}</h3>
                      <div className="flex items-center space-x-2">
                        {period.trend === 'up' ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${period.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          Net: {period.netFlow}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{period.income}</p>
                        <p className="text-sm text-gray-600">Income</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{period.expenses}</p>
                        <p className="text-sm text-gray-600">Expenses</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${period.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {period.netFlow}
                        </p>
                        <p className="text-sm text-gray-600">Net Flow</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Wallet className="w-5 h-5 mr-2" />
                    Project Budgets
                  </CardTitle>
                  <CardDescription>Track project spending against budgets</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Set Budget
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgets.map((budget) => (
                  <div key={budget.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{budget.project}</h3>
                      <Badge variant={budget.percentage > 80 ? 'destructive' : budget.percentage > 60 ? 'secondary' : 'default'}>
                        {budget.percentage}% Used
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget Progress</span>
                        <span className="font-medium">{budget.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            budget.percentage > 80 ? 'bg-red-500' : 
                            budget.percentage > 60 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${budget.percentage}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Budget</p>
                          <p className="font-semibold text-lg">{budget.totalBudget}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Spent</p>
                          <p className="font-semibold text-lg text-red-600">{budget.spent}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Remaining</p>
                          <p className="font-semibold text-lg text-green-600">{budget.remaining}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}