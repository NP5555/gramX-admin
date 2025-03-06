import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, CheckSquare, Trophy, LayersIcon, Home } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: LayersIcon, label: 'Batches', path: '/batches' },
  ];

  return (
    <div className="h-screen w-64 bg-black fixed left-0 top-0 p-4">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl font-bold text-gold-500">Admin Panel</h1>
      </div>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 p-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gold-500 text-black'
                  : 'text-gold-500 hover:bg-gold-500/10'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;