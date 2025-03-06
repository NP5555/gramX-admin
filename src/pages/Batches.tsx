import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { batchApi } from '../lib/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { Batch, ApiError } from '../types';

const Batches = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    batchNumber: 0,
    currentPrice: 0,
    nextPrice: 0,
    tokensSold: 0,
    totalTokens: 0,
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('batches', async () => {
    const result = await batchApi.getAllBatches();
    if (result.error) throw result.error;
    return result.data;
  });

  const createBatchMutation = useMutation(
    (batchData: Omit<Batch, '_id'>) => batchApi.createBatch(batchData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('batches');
        handleCloseModal();
        toast.success('Batch created successfully');
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Failed to create batch');
      },
    }
  );

  const updateBatchMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Batch> }) => batchApi.updateBatch(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('batches');
        handleCloseModal();
        toast.success('Batch updated successfully');
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Failed to update batch');
      },
    }
  );

  const deleteBatchMutation = useMutation(
    (id: string) => batchApi.deleteBatch(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('batches');
        toast.success('Batch deleted successfully');
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Failed to delete batch');
      },
    }
  );

  const handleOpenModal = (batch?: Batch) => {
    if (batch) {
      setIsEditMode(true);
      setSelectedBatch(batch._id);
      setFormData({
        batchNumber: batch.batchNumber,
        currentPrice: batch.currentPrice,
        nextPrice: batch.nextPrice,
        tokensSold: batch.tokensSold,
        totalTokens: batch.totalTokens,
      });
    } else {
      setIsEditMode(false);
      setSelectedBatch(null);
      setFormData({
        batchNumber: 0,
        currentPrice: 0,
        nextPrice: 0,
        tokensSold: 0,
        totalTokens: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedBatch(null);
    setFormData({
      batchNumber: 0,
      currentPrice: 0,
      nextPrice: 0,
      tokensSold: 0,
      totalTokens: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedBatch) {
      updateBatchMutation.mutate({ id: selectedBatch, data: formData });
    } else {
      createBatchMutation.mutate(formData as Omit<Batch, '_id'>);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      deleteBatchMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold-500">Loading batches...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gold-500">Batches</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors"
        >
          Create New Batch
        </button>
      </div>

      {/* Create Batch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Batch"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gold-500 mb-2">Batch Number</label>
            <input
              type="number"
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Current Price</label>
            <input
              type="number"
              value={formData.currentPrice}
              onChange={(e) => setFormData({ ...formData, currentPrice: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Next Price</label>
            <input
              type="number"
              value={formData.nextPrice}
              onChange={(e) => setFormData({ ...formData, nextPrice: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Tokens Sold</label>
            <input
              type="number"
              value={formData.tokensSold}
              onChange={(e) => setFormData({ ...formData, tokensSold: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Total Tokens</label>
            <input
              type="number"
              value={formData.totalTokens}
              onChange={(e) => setFormData({ ...formData, totalTokens: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
              min="0"
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
              disabled={createBatchMutation.isLoading}
            >
              {createBatchMutation.isLoading ? 'Creating...' : 'Create Batch'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-black rounded-lg border border-gold-500/20 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gold-500/10">
            <tr>
              <th className="px-6 py-3 text-left text-gold-500">Batch #</th>
              <th className="px-6 py-3 text-left text-gold-500">Current Price</th>
              <th className="px-6 py-3 text-left text-gold-500">Next Price</th>
              <th className="px-6 py-3 text-left text-gold-500">Tokens Sold</th>
              <th className="px-6 py-3 text-left text-gold-500">Total Tokens</th>
              <th className="px-6 py-3 text-left text-gold-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/10">
            {data?.map((batch) => (
              <tr key={batch._id} className="hover:bg-gold-500/5">
                <td className="px-6 py-4">{batch.batchNumber}</td>
                <td className="px-6 py-4">${batch.currentPrice}</td>
                <td className="px-6 py-4">${batch.nextPrice}</td>
                <td className="px-6 py-4">{batch.tokensSold}</td>
                <td className="px-6 py-4">{batch.totalTokens}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleOpenModal(batch)}
                    className="text-gold-500 hover:text-gold-400 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(batch._id)}
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

export default Batches;