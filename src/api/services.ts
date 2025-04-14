import { API_CONFIG, API_ENDPOINTS } from './config';
import type { Status, Incident, Maintenance, Metric, ApiResponse } from './types';

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const statusApi = {
  getStatus: async (): Promise<ApiResponse<Status[]>> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.status}`, {
      headers: API_CONFIG.headers,
    });
    return handleResponse<Status[]>(response);
  },
};

export const incidentsApi = {
  getIncidents: async (): Promise<ApiResponse<Incident[]>> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.incidents}`, {
      headers: API_CONFIG.headers,
    });
    return handleResponse<Incident[]>(response);
  },

  getIncident: async (id: string): Promise<ApiResponse<Incident>> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.incidents}/${id}`, {
      headers: API_CONFIG.headers,
    });
    return handleResponse<Incident>(response);
  },
};

export const maintenanceApi = {
  getMaintenance: async (): Promise<ApiResponse<Maintenance[]>> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.maintenance}`, {
      headers: API_CONFIG.headers,
    });
    return handleResponse<Maintenance[]>(response);
  },

  getMaintenanceById: async (id: string): Promise<ApiResponse<Maintenance>> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.maintenance}/${id}`, {
      headers: API_CONFIG.headers,
    });
    return handleResponse<Maintenance>(response);
  },
};

export const metricsApi = {
  getMetrics: async (): Promise<ApiResponse<Metric[]>> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.metrics}`, {
      headers: API_CONFIG.headers,
    });
    return handleResponse<Metric[]>(response);
  },

  getMetricById: async (id: string): Promise<ApiResponse<Metric>> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.metrics}/${id}`, {
      headers: API_CONFIG.headers,
    });
    return handleResponse<Metric>(response);
  },
}; 