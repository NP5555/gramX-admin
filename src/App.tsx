import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tasks from './pages/Tasks';
import Leaderboard from './pages/Leaderboard';
import Batches from './pages/Batches';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-black text-white flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/batches" element={<Batches />} />
            </Routes>
          </div>
        </div>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;