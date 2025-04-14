export interface Status {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  lastUpdated: string;
  description?: string;
}

export interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  impact: 'none' | 'minor' | 'major' | 'critical';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  description: string;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  status: string;
  message: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  title: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  startTime: string;
  endTime: string;
  description: string;
  affectedServices: string[];
}

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
} 