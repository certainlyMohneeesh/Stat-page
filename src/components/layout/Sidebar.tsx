import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardIcon, 
  LoginIcon, 
  OverviewIcon, 
  ServicesIcon, 
  IncidentsIcon 
} from '../ui/icons';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/overview', label: 'Overview', icon: <OverviewIcon /> },
    { path: '/services', label: 'Services', icon: <ServicesIcon /> },
    { path: '/incidents', label: 'Incidents', icon: <IncidentsIcon /> },
    { path: '/login', label: 'Login', icon: <LoginIcon /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${
              location.pathname === item.path ? 'bg-gray-700' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 