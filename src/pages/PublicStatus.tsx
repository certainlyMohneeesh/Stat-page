import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { useToast } from '../hooks/use-toast'
import React from 'react'

interface Service {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage'
  description: string
}

export default function PublicStatus() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Mock data for demonstration
        const mockServices: Service[] = [
          {
            id: '1',
            name: 'API Service',
            status: 'operational',
            description: 'Main API service for the application',
          },
          {
            id: '2',
            name: 'Database',
            status: 'degraded',
            description: 'Primary database service',
          },
          {
            id: '3',
            name: 'Website',
            status: 'operational',
            description: 'Public-facing website',
          },
        ]
        setServices(mockServices)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch service statuses',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [toast])

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500'
      case 'degraded':
        return 'bg-yellow-500'
      case 'partial_outage':
        return 'bg-orange-500'
      case 'major_outage':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: Service['status']) => {
    switch (status) {
      case 'operational':
        return 'Operational'
      case 'degraded':
        return 'Degraded Performance'
      case 'partial_outage':
        return 'Partial Outage'
      case 'major_outage':
        return 'Major Outage'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Service Status</h1>
          <p className="text-muted-foreground mt-2">
            Real-time status of our services
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{service.name}</h2>
                    <p className="text-muted-foreground mt-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        service.status
                      )}`}
                    />
                    <span>{getStatusText(service.status)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
} 