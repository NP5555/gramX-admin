import React from 'react';
import { useQuery } from 'react-query';
import { Users, CheckSquare, Trophy, LayersIcon } from 'lucide-react';
import api from '../lib/axios';

const Dashboard = () => {
  const { data: stats } = useQuery('stats', async () => {
    const [users, tasks, leaderboard, batches] = await Promise.all([
      api.get('/admin/users'),
      api.get('/api/tasks'),
      api.get('/admin/leaderboard'),
      api.get('/admin/batches'),
    ]);
    return {
      users: users.data.length,
      tasks: tasks.data.length,
      leaderboard: leaderboard.data.length,
      batches: batches.data.length,
    };
  });

  const cards = [
    { icon: Users, label: 'Total Users', value: stats?.users || 0 },
    { icon: CheckSquare, label: 'Total Tasks', value: stats?.tasks || 0 },
    { icon: Trophy, label: 'Leaderboard Entries', value: stats?.leaderboard || 0 },
    { icon: LayersIcon, label: 'Active Batches', value: stats?.batches || 0 },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gold-500 mb-8">GramX Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-black p-6 rounded-lg border border-gold-500/20">
            <div className="flex items-center justify-between mb-4">
              <card.icon className="text-gold-500" size={24} />
              <span className="text-3xl font-bold text-gold-500">{card.value}</span>
            </div>
            <h3 className="text-gold-500/80">{card.label}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;