import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Services from './pages/Services';
import Incidents from './pages/Incidents';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/toaster'
import { useAuth } from './hooks/useAuth'
import PublicStatus from './pages/PublicStatus'
import NotFound from './pages/NotFound'

const App: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="overview" element={<Overview />} />
          <Route path="services" element={<Services />} />
          <Route path="incidents" element={<Incidents />} />
        </Route>
        {isAuthenticated && (
          <>
            <Route path="/dashboard/services" element={<Dashboard />} />
            <Route path="/dashboard/incidents" element={<Dashboard />} />
            <Route path="/dashboard/settings" element={<Dashboard />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App; 