import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userApi } from '../lib/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { User } from '../types';

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    referralCode: '',
    tokens: 0,
    shares: 0,
    profileImage: '',
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery('users', async () => {
    const result = await userApi.getAllUsers();
    if (result.error) {
      throw result.error;
    }
    return result.data;
  }, {
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch users');
    }
  });

  const createUserMutation = useMutation(
    (userData: typeof formData) => userApi.createUser(userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        handleCloseModal();
        toast.success('User created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create user');
      },
    }
  );

  const updateUserMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<User> }) => userApi.updateUser(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        handleCloseModal();
        toast.success('User updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update user');
      },
    }
  );

  const deleteUserMutation = useMutation(
    (id: string) => userApi.deleteUser(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User deleted successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete user');
      },
    }
  );

  const handleOpenModal = (user?: User) => {
    if (user) {
      setIsEditMode(true);
      setSelectedUser(user._id);
      setFormData({
        name: user.name,
        referralCode: user.referralCode,
        tokens: user.tokens,
        shares: user.shares,
        profileImage: user.profileImage || '',
      });
    } else {
      setIsEditMode(false);
      setSelectedUser(null);
      setFormData({
        name: '',
        referralCode: '',
        tokens: 0,
        shares: 0,
        profileImage: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      referralCode: '',
      tokens: 0,
      shares: 0,
      profileImage: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedUser) {
      updateUserMutation.mutate({ id: selectedUser, data: formData });
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gold-500">Users</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors"
        >
          Add New User
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? "Edit User" : "Create New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gold-500 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Referral Code</label>
            <input
              type="text"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Tokens</label>
            <input
              type="number"
              value={formData.tokens}
              onChange={(e) => setFormData({ ...formData, tokens: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
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
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Profile Image URL</label>
            <input
              type="url"
              value={formData.profileImage}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors"
              disabled={createUserMutation.isLoading || updateUserMutation.isLoading}
            >
              {createUserMutation.isLoading || updateUserMutation.isLoading
                ? (isEditMode ? 'Updating...' : 'Creating...')
                : (isEditMode ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-black rounded-lg border border-gold-500/20 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gold-500/10">
            <tr>
              <th className="px-6 py-3 text-left text-gold-500">Name</th>
              <th className="px-6 py-3 text-left text-gold-500">Referral Code</th>
              <th className="px-6 py-3 text-left text-gold-500">Tokens</th>
              <th className="px-6 py-3 text-left text-gold-500">Shares</th>
              <th className="px-6 py-3 text-left text-gold-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/10">
            {data?.map((user) => (
              <tr key={user._id} className="hover:bg-gold-500/5">
                <td className="px-6 py-4 flex items-center">
                  {user.profileImage && (
                    <img src={user.profileImage} alt="" className="w-8 h-8 rounded-full mr-2" />
                  )}
                  {user.name}
                </td>
                <td className="px-6 py-4">{user.referralCode}</td>
                <td className="px-6 py-4">{user.tokens}</td>
                <td className="px-6 py-4">{user.shares}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleOpenModal(user)}
                    className="text-gold-500 hover:text-gold-400 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
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
  );
};

export default Users;