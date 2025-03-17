import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { leaderboardApi } from '../lib/api';
import { userApi } from '../lib/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { LeaderboardEntry, User, ApiError } from '../types';

const Leaderboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    coins: 0,
    shares: 0,
  });

  const queryClient = useQueryClient();

  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery('leaderboard', async () => {
    const result = await leaderboardApi.getLeaderboard();
    if (result.error) throw result.error;
    return result.data;
  }, {
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to fetch leaderboard');
    }
  });

  // Fetch users for the dropdown
  const { data: users } = useQuery('users', async () => {
    const result = await userApi.getAllUsers();
    if (result.error) throw result.error;
    return result.data;
  });

  const createEntryMutation = useMutation(
    (entryData: typeof formData) => leaderboardApi.createEntry(entryData),
    {
      onSuccess: (response) => {
        if (response.error) {
          toast.error(response.error.message || 'Entry not added - score not high enough');
          return;
        }
        queryClient.invalidateQueries('leaderboard');
        handleCloseModal();
        toast.success('Leaderboard entry created successfully');
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Failed to create entry');
      },
    }
  );

  const deleteEntryMutation = useMutation(
    (id: string) => leaderboardApi.deleteEntry(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('leaderboard');
        toast.success('Entry deleted successfully');
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Failed to delete entry');
      },
    }
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      userId: '',
      coins: 0,
      shares: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEntryMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntryMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold-500">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-500">Leaderboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors"
        >
          Add New Entry
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Leaderboard Entry"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gold-500 mb-2">User</label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-3 text-white"
              required
            >
              <option value="">Select a user</option>
              {users?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Coins</label>
            <input
              type="number"
              value={formData.coins}
              onChange={(e) => setFormData({ ...formData, coins: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-3 text-white"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Shares</label>
            <input
              type="number"
              value={formData.shares}
              onChange={(e) => setFormData({ ...formData, shares: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-3 text-white"
              required
              min="0"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0 pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-3 text-gray-400 hover:text-gray-200 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gold-500 text-black px-4 py-3 rounded-lg hover:bg-gold-600 transition-colors order-1 sm:order-2"
              disabled={createEntryMutation.isLoading}
            >
              {createEntryMutation.isLoading ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </Modal>

      {/* For larger screens - table view */}
      <div className="hidden sm:block bg-black rounded-lg border border-gold-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gold-500/10">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-gold-500 whitespace-nowrap">Position</th>
                <th className="px-3 sm:px-6 py-3 text-left text-gold-500 whitespace-nowrap">User</th>
                <th className="px-3 sm:px-6 py-3 text-left text-gold-500 whitespace-nowrap">Coins</th>
                <th className="px-3 sm:px-6 py-3 text-left text-gold-500 whitespace-nowrap">Shares</th>
                <th className="px-3 sm:px-6 py-3 text-left text-gold-500 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {leaderboard?.map((entry) => (
                <tr key={entry._id} className="hover:bg-gold-500/5">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{entry.postion}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {entry.userId ? entry.userId.name : 'Unknown User'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{entry.coins}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{entry.shares}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* For mobile - card view */}
      <div className="sm:hidden space-y-4">
        {leaderboard?.map((entry) => (
          <div key={entry._id} className="bg-black rounded-lg border border-gold-500/20 p-4 hover:bg-gold-500/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gold-500 font-medium">Position: {entry.postion}</span>
              <button
                onClick={() => handleDelete(entry._id)}
                className="text-red-500 hover:text-red-400 p-2"
              >
                Delete
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-2">
              <span className="text-gold-500/80">User:</span>
              <span>{entry.userId ? entry.userId.name : 'Unknown User'}</span>
              <span className="text-gold-500/80">Coins:</span>
              <span>{entry.coins}</span>
              <span className="text-gold-500/80">Shares:</span>
              <span>{entry.shares}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;