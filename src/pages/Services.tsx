import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Service {
  id: string;
  name: string;
  status: string;
  description: string;
  uptime: string;
}

const Services: React.FC = () => {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      return response.json();
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'outage':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading services</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Services</h2>
      <div className="grid grid-cols-1 gap-6">
        {services?.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="text-gray-600 mt-1">{service.description}</p>
              </div>
              <div className="text-right">
                <span className={`font-medium ${getStatusColor(service.status)}`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
                <p className="text-sm text-gray-500 mt-1">Uptime: {service.uptime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services; 