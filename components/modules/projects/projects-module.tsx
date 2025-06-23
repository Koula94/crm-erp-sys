'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { 
  FolderOpen, 
  Plus, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  MapPin
} from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'Villa Construction Downtown',
    client: 'Rodriguez Family',
    status: 'In Progress',
    progress: 65,
    startDate: '2023-12-01',
    endDate: '2024-03-15',
    budget: '$89,500',
    location: 'Downtown District',
    manager: 'Carlos Mendez',
    team: 8
  },
  {
    id: 2,
    name: 'Office Building Renovation',
    client: 'Tech Corp SA',
    status: 'Planning',
    progress: 25,
    startDate: '2024-02-01',
    endDate: '2024-04-20',
    budget: '$156,000',
    location: 'Business District',
    manager: 'Ana Torres',
    team: 12
  },
  {
    id: 3,
    name: 'Residential Complex Phase 2',
    client: 'Urban Developers',
    status: 'In Progress',
    progress: 85,
    startDate: '2023-10-15',
    endDate: '2024-02-28',
    budget: '$245,000',
    location: 'North Zone',
    manager: 'Luis Ramirez',
    team: 15
  }
];

const tasks = [
  {
    id: 1,
    title: 'Foundation Inspection',
    project: 'Villa Construction Downtown',
    assignee: 'Miguel Santos',
    dueDate: '2024-01-25',
    status: 'In Progress',
    priority: 'High'
  },
  {
    id: 2,
    title: 'Material Procurement',
    project: 'Office Building Renovation',
    assignee: 'Sofia Garcia',
    dueDate: '2024-01-28',
    status: 'Pending',
    priority: 'Medium'
  },
  {
    id: 3,
    title: 'Electrical Installation',
    project: 'Residential Complex Phase 2',
    assignee: 'Roberto Diaz',
    dueDate: '2024-01-30',
    status: 'Completed',
    priority: 'High'
  }
];

export function ProjectsModule() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Planning': return 'outline';
      case 'On Hold': return 'destructive';
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
            <FolderOpen className="w-8 h-8 mr-3 text-orange-500" />
            Projects Module
          </h1>
          <p className="text-gray-600 mt-2">Manage construction projects and track progress</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="border-0 shadow-md card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        {project.client}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium text-green-600">{project.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manager:</span>
                      <span className="font-medium">{project.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Size:</span>
                      <span className="font-medium">{project.team} members</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {project.startDate} - {project.endDate}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>Track and manage project tasks across all projects</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{task.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{task.project}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{task.assignee}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{task.dueDate}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {task.status === 'Completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {task.status === 'In Progress' && <Clock className="w-4 h-4 text-blue-500" />}
                          {task.status === 'Pending' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                          <span className="text-sm">{task.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
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

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Project Calendar</CardTitle>
                <CardDescription>View project deadlines and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Important dates and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <Badge variant={getPriorityColor(task.priority)} className="ml-2">
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.project}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Assigned to: {task.assignee}</span>
                        <span className="font-medium text-orange-600">Due: {task.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}