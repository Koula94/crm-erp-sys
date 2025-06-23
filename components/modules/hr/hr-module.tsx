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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign,
  Clock,
  Users
} from 'lucide-react';

const employees = [
  {
    id: 1,
    name: 'Carlos Mendez',
    position: 'Project Manager',
    department: 'Construction',
    email: 'carlos.mendez@kadimar.com',
    phone: '+1 234-567-8901',
    hireDate: '2022-03-15',
    salary: '$65,000',
    status: 'Active',
    location: 'Main Office'
  },
  {
    id: 2,
    name: 'Ana Torres',
    position: 'Site Supervisor',
    department: 'Construction',
    email: 'ana.torres@kadimar.com',
    phone: '+1 234-567-8902',
    hireDate: '2021-08-20',
    salary: '$48,000',
    status: 'Active',
    location: 'Field'
  },
  {
    id: 3,
    name: 'Luis Ramirez',
    position: 'Senior Foreman',
    department: 'Construction',
    email: 'luis.ramirez@kadimar.com',
    phone: '+1 234-567-8903',
    hireDate: '2020-01-10',
    salary: '$52,000',
    status: 'Active',
    location: 'Field'
  },
  {
    id: 4,
    name: 'Sofia Garcia',
    position: 'Procurement Specialist',
    department: 'Logistics',
    email: 'sofia.garcia@kadimar.com',
    phone: '+1 234-567-8904',
    hireDate: '2023-05-12',
    salary: '$42,000',
    status: 'Active',
    location: 'Main Office'
  }
];

const payrollData = [
  {
    id: 1,
    employee: 'Carlos Mendez',
    position: 'Project Manager',
    baseSalary: '$5,417',
    overtime: '$320',
    bonuses: '$500',
    deductions: '$1,247',
    netPay: '$4,990',
    payPeriod: 'January 2024'
  },
  {
    id: 2,
    employee: 'Ana Torres',
    position: 'Site Supervisor',
    baseSalary: '$4,000',
    overtime: '$480',
    bonuses: '$200',
    deductions: '$936',
    netPay: '$3,744',
    payPeriod: 'January 2024'
  },
  {
    id: 3,
    employee: 'Luis Ramirez',
    position: 'Senior Foreman',
    baseSalary: '$4,333',
    overtime: '$650',
    bonuses: '$300',
    deductions: '$1,057',
    netPay: '$4,226',
    payPeriod: 'January 2024'
  }
];

const attendance = [
  {
    id: 1,
    employee: 'Carlos Mendez',
    date: '2024-01-22',
    checkIn: '08:00 AM',
    checkOut: '05:30 PM',
    hoursWorked: '9.5',
    status: 'Present',
    project: 'Villa Downtown'
  },
  {
    id: 2,
    employee: 'Ana Torres',
    date: '2024-01-22',
    checkIn: '07:30 AM',
    checkOut: '04:00 PM',
    hoursWorked: '8.5',
    status: 'Present',
    project: 'Office Building'
  },
  {
    id: 3,
    employee: 'Luis Ramirez',
    date: '2024-01-22',
    checkIn: '07:00 AM',
    checkOut: '06:00 PM',
    hoursWorked: '11.0',
    status: 'Overtime',
    project: 'Residential Complex'
  }
];

export function HRModule() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'On Leave': return 'outline';
      default: return 'outline';
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'Present': return 'default';
      case 'Overtime': return 'secondary';
      case 'Absent': return 'destructive';
      case 'Late': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserCheck className="w-8 h-8 mr-3 text-orange-500" />
            HR Module
          </h1>
          <p className="text-gray-600 mt-2">Manage employees, payroll, and attendance</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Management</CardTitle>
                  <CardDescription>Manage your workforce and employee information</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search employees..."
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
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={`/avatars/employee-${employee.id}.png`} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{employee.name}</p>
                            <p className="text-sm text-gray-500">{employee.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{employee.position}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {employee.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            {employee.email}
                          </p>
                          <p className="text-sm flex items-center">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            {employee.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex items-center">
                          <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                          {employee.hireDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600">{employee.salary}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(employee.status)}>
                          {employee.status}
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

        <TabsContent value="payroll" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Payroll Management
                  </CardTitle>
                  <CardDescription>Process and manage employee payroll</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Process Payroll
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Bonuses</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((payroll) => (
                    <TableRow key={payroll.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{payroll.employee}</div>
                          <div className="text-sm text-gray-500">{payroll.position}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{payroll.baseSalary}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-blue-600 font-medium">{payroll.overtime}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-green-600 font-medium">{payroll.bonuses}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-red-600 font-medium">-{payroll.deductions}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-lg text-green-600">{payroll.netPay}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{payroll.payPeriod}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Print
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

        <TabsContent value="attendance" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Attendance Tracking
                  </CardTitle>
                  <CardDescription>Monitor employee attendance and working hours</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Manual Entry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{record.employee}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{record.date}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-green-600 font-medium">{record.checkIn}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-red-600 font-medium">{record.checkOut}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.hoursWorked}h</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getAttendanceColor(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{record.project}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Report
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
      </Tabs>
    </div>
  );
}