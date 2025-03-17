import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { taskApi } from '../lib/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { Task, ApiError } from '../types';

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    task: '',
    reward: 0,
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('tasks', async () => {
    const result = await taskApi.getAllTasks();
    if (result.error) throw result.error;
    return result.data;
  });

  const createTaskMutation = useMutation(
    (taskData: typeof formData) => taskApi.createTask(taskData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        handleCloseModal();
        toast.success('Task created successfully');
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Failed to create task');
      },
    }
  );

  const updateTaskMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Task> }) => taskApi.updateTask(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        handleCloseModal();
        toast.success('Task updated successfully');
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Failed to update task');
      },
    }
  );

  const deleteTaskMutation = useMutation(
    (id: string) => taskApi.deleteTask(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        toast.success('Task deleted successfully');
      },
      onError: (error: ApiError) => {
        toast.error(error.message || 'Failed to delete task');
      },
    }
  );

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setIsEditMode(true);
      setSelectedTask(task._id);
      setFormData({
        task: task.task,
        reward: task.reward,
      });
    } else {
      setIsEditMode(false);
      setSelectedTask(null);
      setFormData({
        task: '',
        reward: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedTask(null);
    setFormData({
      task: '',
      reward: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedTask) {
      updateTaskMutation.mutate({ id: selectedTask, data: formData });
    } else {
      createTaskMutation.mutate(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-500">Tasks</h1>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors"
        >
          Create New Task
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? "Edit Task" : "Create New Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gold-500 mb-2">Task Description</label>
            <textarea
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-3 text-white"
              required
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gold-500 mb-2">Reward</label>
            <input
              type="number"
              value={formData.reward}
              onChange={(e) => setFormData({ ...formData, reward: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-3 text-white"
              required
              min="0"
              step="0.01"
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
              disabled={createTaskMutation.isLoading || updateTaskMutation.isLoading}
            >
              {createTaskMutation.isLoading || updateTaskMutation.isLoading
                ? (isEditMode ? 'Updating...' : 'Creating...')
                : (isEditMode ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </Modal>

      {/* For larger screens - table view */}
      <div className="hidden sm:block bg-black rounded-lg border border-gold-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gold-500/10">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-gold-500 whitespace-nowrap">Task</th>
                <th className="px-3 sm:px-6 py-3 text-left text-gold-500 whitespace-nowrap">Reward</th>
                <th className="px-3 sm:px-6 py-3 text-left text-gold-500 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {data?.map((task) => (
                <tr key={task._id} className="hover:bg-gold-500/5">
                  <td className="px-3 sm:px-6 py-4">{task.task}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{task.reward}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="text-gold-500 hover:text-gold-400 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
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
        {data?.map((task) => (
          <div key={task._id} className="bg-black rounded-lg border border-gold-500/20 p-4 hover:bg-gold-500/5">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gold-500/80 font-medium">Reward: {task.reward}</span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleOpenModal(task)}
                    className="text-gold-500 hover:text-gold-400 p-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 hover:text-red-400 p-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="border-t border-gold-500/10 pt-3">
                <p className="text-white">{task.task}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;