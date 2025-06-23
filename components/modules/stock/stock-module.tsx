'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  Package, 
  Plus, 
  Search, 
  AlertTriangle,
  CheckCircle,
  Truck,
  Wrench,
  Boxes,
  MapPin
} from 'lucide-react';

const inventory = [
  {
    id: 1,
    name: 'Concrete Mixer',
    category: 'Equipment',
    sku: 'EQ-CM-001',
    quantity: 5,
    minStock: 2,
    unit: 'units',
    location: 'Warehouse A',
    condition: 'Good',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15'
  },
  {
    id: 2,
    name: 'Steel Rebar 12mm',
    category: 'Materials',
    sku: 'MT-RB-012',
    quantity: 850,
    minStock: 200,
    unit: 'kg',
    location: 'Yard B',
    condition: 'New',
    lastMaintenance: 'N/A',
    nextMaintenance: 'N/A'
  },
  {
    id: 3,
    name: 'Safety Helmets',
    category: 'Safety',
    sku: 'SF-HM-001',
    quantity: 45,
    minStock: 20,
    unit: 'units',
    location: 'Storage Room',
    condition: 'Good',
    lastMaintenance: 'N/A',
    nextMaintenance: 'N/A'
  },
  {
    id: 4,
    name: 'Excavator CAT 320',
    category: 'Heavy Equipment',
    sku: 'HE-EX-320',
    quantity: 2,
    minStock: 1,
    unit: 'units',
    location: 'Main Yard',
    condition: 'Excellent',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-07-10'
  }
];

const movements = [
  {
    id: 1,
    item: 'Concrete Mixer',
    type: 'Check Out',
    quantity: 2,
    project: 'Villa Downtown',
    employee: 'Carlos Mendez',
    date: '2024-01-22',
    time: '08:30 AM',
    notes: 'For foundation work'
  },
  {
    id: 2,
    item: 'Steel Rebar 12mm',
    type: 'Delivery',
    quantity: 500,
    project: 'Incoming Stock',
    employee: 'Sofia Garcia',
    date: '2024-01-21',
    time: '02:15 PM',
    notes: 'Weekly delivery from supplier'
  },
  {
    id: 3,
    item: 'Safety Helmets',
    type: 'Check Out',
    quantity: 15,
    project: 'Residential Complex',
    employee: 'Luis Ramirez',
    date: '2024-01-20',
    time: '07:00 AM',
    notes: 'New team members'
  }
];

const maintenance = [
  {
    id: 1,
    equipment: 'Excavator CAT 320',
    type: 'Scheduled',
    priority: 'High',
    dueDate: '2024-07-10',
    lastService: '2024-01-10',
    technician: 'Roberto Diaz',
    status: 'Pending',
    cost: '$2,500',
    description: '6-month major service'
  },
  {
    id: 2,
    equipment: 'Concrete Mixer',
    type: 'Preventive',
    priority: 'Medium',
    dueDate: '2024-04-15',
    lastService: '2024-01-15',
    technician: 'Miguel Santos',
    status: 'Scheduled',
    cost: '$350',
    description: 'Engine maintenance and cleaning'
  },
  {
    id: 3,
    equipment: 'Tower Crane TC-01',
    type: 'Repair',
    priority: 'High',
    dueDate: '2024-01-25',
    lastService: '2023-12-01',
    technician: 'Roberto Diaz',
    status: 'In Progress',
    cost: '$1,200',
    description: 'Hydraulic system repair'
  }
];

export function StockModule() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStockStatus = (current: number, min: number) => {
    const percentage = (current / (min * 2)) * 100;
    if (percentage <= 50) return { status: 'Low', color: 'destructive' };
    if (percentage <= 100) return { status: 'Medium', color: 'secondary' };
    return { status: 'Good', color: 'default' };
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'default';
      case 'Good': return 'secondary';
      case 'Fair': return 'outline';
      case 'Poor': return 'destructive';
      default: return 'outline';
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'Check Out': return 'destructive';
      case 'Check In': return 'default';
      case 'Delivery': return 'secondary';
      case 'Transfer': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3 text-orange-500" />
            Stock Module
          </h1>
          <p className="text-gray-600 mt-2">Manage equipment, materials, and inventory tracking</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Boxes className="w-5 h-5 mr-2" />
                    Inventory Management
                  </CardTitle>
                  <CardDescription>Track equipment, materials, and supplies</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search inventory..."
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
                    <TableHead>Item</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const stockStatus = getStockStatus(item.quantity, item.minStock);
                    return (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.category} • SKU: {item.sku}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.quantity} {item.unit}</span>
                              <Badge variant={stockStatus.color}>
                                {stockStatus.status}
                              </Badge>
                            </div>
                            <Progress 
                              value={(item.quantity / (item.minStock * 3)) * 100} 
                              className="h-2" 
                            />
                            <div className="text-xs text-gray-500">
                              Min: {item.minStock} {item.unit}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {item.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getConditionColor(item.condition)}>
                            {item.condition}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {item.lastMaintenance !== 'N/A' ? (
                              <>
                                <div>Last: {item.lastMaintenance}</div>
                                <div className="text-orange-600">Next: {item.nextMaintenance}</div>
                              </>
                            ) : (
                              <span className="text-gray-500">No maintenance required</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              Move
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Inventory Movements
                  </CardTitle>
                  <CardDescription>Track equipment and material movements</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Movement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Project/Location</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{movement.item}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getMovementColor(movement.type)}>
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{movement.quantity}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{movement.project}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{movement.employee}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{movement.date}</div>
                          <div className="text-gray-500">{movement.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{movement.notes}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Equipment Maintenance
                  </CardTitle>
                  <CardDescription>Schedule and track equipment maintenance</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenance.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{item.equipment}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{item.type}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{item.dueDate}</div>
                          <div className="text-gray-500">Last: {item.lastService}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{item.technician}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {item.status === 'In Progress' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                          {item.status === 'Pending' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                          <span className="text-sm">{item.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">{item.cost}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Complete
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