import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { useToast } from '../hooks/use-toast'
import {
  LayoutDashboard,
  Server,
  AlertTriangle,
  Settings,
  LogOut,
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    try {
      logout()
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">System Status</h3>
          <p className="text-green-600">All systems operational</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Incidents</h3>
          <p className="text-gray-600">No active incidents</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Uptime</h3>
          <p className="text-gray-600">99.99%</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 