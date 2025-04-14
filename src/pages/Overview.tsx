import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface SystemStatus {
  overallStatus: string;
  activeIncidents: number;
  services: {
    name: string;
    status: string;
    uptime: string;
  }[];
}

const Overview: React.FC = () => {
  const { data: systemStatus, isLoading, error } = useQuery<SystemStatus>({
    queryKey: ['system-status'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/system-status');
      if (!response.ok) {
        throw new Error('Failed to fetch system status');
      }
      return response.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading system status</div>;
  if (!systemStatus) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            {systemStatus.services.map((service) => (
              <div key={service.name} className="flex justify-between items-center">
                <span className="text-gray-600">{service.name}</span>
                <span className={`${
                  service.status === 'operational' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overall Status</span>
              <span className={`${
                systemStatus.overallStatus === 'operational' ? 'text-green-600' : 'text-red-600'
              }`}>
                {systemStatus.overallStatus.charAt(0).toUpperCase() + systemStatus.overallStatus.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Incidents</span>
              <span className="text-gray-600">{systemStatus.activeIncidents}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Overview; 