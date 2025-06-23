'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const stats = [
  {
    title: 'Active Projects',
    value: '12',
    change: '+2 this month',
    icon: FolderOpen,
    color: 'bg-blue-500',
    trend: 'up'
  },
  {
    title: 'Total Clients',
    value: '48',
    change: '+8 this month',
    icon: Users,
    color: 'bg-green-500',
    trend: 'up'
  },
  {
    title: 'Monthly Revenue',
    value: '$124,500',
    change: '+12% from last month',
    icon: DollarSign,
    color: 'bg-orange-500',
    trend: 'up'
  },
  {
    title: 'Pending Quotes',
    value: '7',
    change: '2 due today',
    icon: TrendingUp,
    color: 'bg-purple-500',
    trend: 'neutral'
  },
];

const recentProjects = [
  {
    id: 1,
    name: 'Villa Construction - Downtown',
    client: 'Rodriguez Family',
    status: 'In Progress',
    progress: 65,
    dueDate: '2024-03-15',
    priority: 'High'
  },
  {
    id: 2,
    name: 'Office Building Renovation',
    client: 'Tech Corp SA',
    status: 'Planning',
    progress: 25,
    dueDate: '2024-04-20',
    priority: 'Medium'
  },
  {
    id: 3,
    name: 'Residential Complex Phase 2',
    client: 'Urban Developers',
    status: 'In Progress',
    progress: 85,
    dueDate: '2024-02-28',
    priority: 'High'
  }
];

const upcomingTasks = [
  {
    id: 1,
    task: 'Site inspection - Villa Downtown',
    time: '09:00 AM',
    status: 'pending'
  },
  {
    id: 2,
    task: 'Client meeting - Office Building',
    time: '02:00 PM',
    status: 'pending'
  },
  {
    id: 3,
    task: 'Material delivery - Residential Complex',
    time: '04:30 PM',
    status: 'completed'
  }
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at KADIMAR today.</p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {stats.map((stat, index) => (
          <Card key={index} className="card-hover border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="w-5 h-5 mr-2 text-orange-500" />
              Recent Projects
            </CardTitle>
            <CardDescription>Track progress of your active construction projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.client}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={project.priority === 'High' ? 'destructive' : 'secondary'}
                      >
                        {project.priority}
                      </Badge>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Due: {project.dueDate}</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your tasks and appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.task}
                    </p>
                    <p className="text-xs text-gray-500">{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}