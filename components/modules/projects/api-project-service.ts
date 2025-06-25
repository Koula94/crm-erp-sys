// API service for project management

export interface ApiProject {
  id?: number;
  name: string;
  client: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  progress: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  budget: number;
  location: string;
  manager: string;
  teamSize: number;
}

export interface Project {
  id?: number;
  name: string;
  client: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  progress: number;
  startDate: string;
  endDate: string;
  budget: string; // Formatted as currency
  location: string;
  manager: string;
  team: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Mapping functions
function mapApiProjectToProject(apiProject: ApiProject): Project {
  return {
    id: apiProject.id,
    name: apiProject.name,
    client: apiProject.client,
    status: mapApiStatusToUI(apiProject.status),
    progress: apiProject.progress,
    startDate: apiProject.startDate,
    endDate: apiProject.endDate,
    budget: `$${apiProject.budget.toLocaleString()}`,
    location: apiProject.location,
    manager: apiProject.manager,
    team: apiProject.teamSize
  };
}

function mapProjectToApiProject(project: Partial<Project>): Partial<ApiProject> {
  return {
    id: project.id,
    name: project.name || '',
    client: project.client || '',
    status: mapUIStatusToApi(project.status || 'Planning'),
    progress: project.progress || 0,
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    budget: typeof project.budget === 'string' 
      ? parseFloat(project.budget.replace(/[$,]/g, '')) || 0
      : 0,
    location: project.location || '',
    manager: project.manager || '',
    teamSize: project.team || 1
  };
}

function mapApiStatusToUI(status: ApiProject['status']): Project['status'] {
  switch (status) {
    case 'PLANNING': return 'Planning';
    case 'IN_PROGRESS': return 'In Progress';
    case 'ON_HOLD': return 'On Hold';
    case 'COMPLETED': return 'Completed';
    case 'CANCELLED': return 'Cancelled';
    default: return 'Planning';
  }
}

function mapUIStatusToApi(status: Project['status']): ApiProject['status'] {
  switch (status) {
    case 'Planning': return 'PLANNING';
    case 'In Progress': return 'IN_PROGRESS';
    case 'On Hold': return 'ON_HOLD';
    case 'Completed': return 'COMPLETED';
    case 'Cancelled': return 'CANCELLED';
    default: return 'PLANNING';
  }
}

class ApiProjectService {
  private static instance: ApiProjectService;
  private baseUrl = 'http://localhost:8080/api/projects';

  private constructor() {}

  static getInstance(): ApiProjectService {
    if (!ApiProjectService.instance) {
      ApiProjectService.instance = new ApiProjectService();
    }
    return ApiProjectService.instance;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async getAllProjects(): Promise<ApiResponse<Project[]>> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiProjects: ApiProject[] = await response.json();
      const projects = apiProjects.map(mapApiProjectToProject);
      return { data: projects };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProjectById(id: number): Promise<ApiResponse<Project>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiProject: ApiProject = await response.json();
      const project = mapApiProjectToProject(apiProject);
      return { data: project };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createProject(project: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const apiProject = mapProjectToApiProject(project);
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiProject),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdApiProject: ApiProject = await response.json();
      const createdProject = mapApiProjectToProject(createdApiProject);
      return { data: createdProject };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateProject(id: number, project: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const apiProject = mapProjectToApiProject(project);
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiProject),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedApiProject: ApiProject = await response.json();
      const updatedProject = mapApiProjectToProject(updatedApiProject);
      return { data: updatedProject };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteProject(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { data: undefined };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProjectsByStatus(status: Project['status']): Promise<ApiResponse<Project[]>> {
    try {
      const apiStatus = mapUIStatusToApi(status);
      const response = await fetch(`${this.baseUrl}/status/${apiStatus}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiProjects: ApiProject[] = await response.json();
      const projects = apiProjects.map(mapApiProjectToProject);
      return { data: projects };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async searchProjects(searchTerm: string): Promise<ApiResponse<Project[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiProjects: ApiProject[] = await response.json();
      const projects = apiProjects.map(mapApiProjectToProject);
      return { data: projects };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getActiveProjects(): Promise<ApiResponse<Project[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/active`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiProjects: ApiProject[] = await response.json();
      const projects = apiProjects.map(mapApiProjectToProject);
      return { data: projects };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const apiProjectService = ApiProjectService.getInstance();