import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Incident {
  id: string;
  title: string;
  status: string;
  severity: string;
  description: string;
  createdAt: string;
}

const Incidents: React.FC = () => {
  const { data: incidents, isLoading, error } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/incidents');
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      return response.json();
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600';
      case 'investigating':
        return 'text-yellow-600';
      case 'identified':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading incidents</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Incidents</h2>
      <div className="grid grid-cols-1 gap-6">
        {incidents?.map((incident) => (
          <div key={incident.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{incident.title}</h3>
                <p className="text-gray-600 mt-1">{incident.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Date: {new Date(incident.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`font-medium ${getStatusColor(incident.status)}`}>
                  {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                </span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                    incident.severity
                  )}`}
                >
                  {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Incidents; 