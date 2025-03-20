import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, CheckSquare, Trophy, LayersIcon, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/', icon: Users, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/batches', icon: LayersIcon, label: 'Batches' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-gold-500/20">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gold-500">GramX Admin</h1>
      </div>

      <nav className="mt-6">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center px-6 py-3 text-gray-400 hover:text-gold-500 hover:bg-gold-500/5 ${
              location.pathname === link.to ? 'text-gold-500 bg-gold-500/5' : ''
            }`}
          >
            <link.icon className="w-5 h-5 mr-3" />
            {link.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-gray-400 hover:text-red-500 hover:bg-red-500/5 mt-auto"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;