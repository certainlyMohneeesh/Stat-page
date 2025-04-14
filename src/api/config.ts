export const API_CONFIG = {
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
export const API_ENDPOINTS = {
  status: '/status',
  incidents: '/incidents',
  maintenance: '/maintenance',
  metrics: '/metrics',
} as const; 