import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { taskApi, Task } from '../lib/api/tasks';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const PLATFORMS = ['twitter', 'youtube', 'instagram', 'telegram', 'other'] as const;
const VERIFICATION_METHODS = ['api', 'manual', 'screenshot', 'oauth'] as const;

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    reward: 0,
    platform: 'twitter' as Task['platform'],
    platformId: '',
    verificationMethod: 'api' as Task['verificationMethod'],
  });

  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery('tasks', async () => {
    const result = await taskApi.getAllTasks();
    if (result.error) throw result.error;
    return result.data;
  });

  // Create task mutation
  const createTaskMutation = useMutation(
    (taskData: typeof formData) => taskApi.createTask(taskData),
    {
      onSuccess: (response) => {
        if (response.error) {
          toast.error(response.error.message);
          return;
        }
        queryClient.invalidateQueries('tasks');
        handleCloseModal();
        toast.success('Task created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create task');
      },
    }
  );

  // Update task mutation
  const updateTaskMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Task> }) => taskApi.updateTask(id, data),
    {
      onSuccess: (response) => {
        if (response.error) {
          toast.error(response.error.message);
          return;
        }
        queryClient.invalidateQueries('tasks');
        handleCloseModal();
        toast.success('Task updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update task');
      },
    }
  );

  // Delete task mutation
  const deleteTaskMutation = useMutation(
    (id: string) => taskApi.deleteTask(id),
    {
      onSuccess: (response) => {
        if (response.error) {
          toast.error(response.error.message);
          return;
        }
        queryClient.invalidateQueries('tasks');
        toast.success('Task deleted successfully');
      },
      onError: (error: any) => {
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
        description: task.description,
        reward: task.reward,
        platform: task.platform,
        platformId: task.platformId || '',
        verificationMethod: task.verificationMethod,
      });
    } else {
      setIsEditMode(false);
      setSelectedTask(null);
      setFormData({
        task: '',
        description: '',
        reward: 0,
        platform: 'twitter',
        platformId: '',
        verificationMethod: 'api',
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
      description: '',
      reward: 0,
      platform: 'twitter',
      platformId: '',
      verificationMethod: 'api',
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

  const handleDelete = (id: string) => {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gold-500">Tasks</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors"
        >
          Add New Task
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? "Edit Task" : "Create New Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gold-500 mb-2">Task Name</label>
            <input
              type="text"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gold-500 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-gold-500 mb-2">Reward</label>
            <input
              type="number"
              value={formData.reward}
              onChange={(e) => setFormData({ ...formData, reward: Number(e.target.value) })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-gold-500 mb-2">Platform</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value as Task['platform'] })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
            >
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gold-500 mb-2">Platform ID (Optional)</label>
            <input
              type="text"
              value={formData.platformId}
              onChange={(e) => setFormData({ ...formData, platformId: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              placeholder="Optional platform-specific ID"
            />
          </div>

          <div>
            <label className="block text-gold-500 mb-2">Verification Method</label>
            <select
              value={formData.verificationMethod}
              onChange={(e) => setFormData({ ...formData, verificationMethod: e.target.value as Task['verificationMethod'] })}
              className="w-full bg-gray-800 border border-gold-500/20 rounded px-3 py-2 text-white"
              required
            >
              {VERIFICATION_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method.toUpperCase()}
                </option>
              ))}
            </select>
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
              disabled={createTaskMutation.isLoading || updateTaskMutation.isLoading}
            >
              {createTaskMutation.isLoading || updateTaskMutation.isLoading
                ? (isEditMode ? 'Updating...' : 'Creating...')
                : (isEditMode ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-black rounded-lg border border-gold-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gold-500/10">
              <tr>
                <th className="px-6 py-3 text-left text-gold-500">Task</th>
                <th className="px-6 py-3 text-left text-gold-500">Description</th>
                <th className="px-6 py-3 text-left text-gold-500">Reward</th>
                <th className="px-6 py-3 text-left text-gold-500">Platform</th>
                <th className="px-6 py-3 text-left text-gold-500">Verification</th>
                <th className="px-6 py-3 text-left text-gold-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {tasks?.map((task) => (
                <tr key={task._id} className="hover:bg-gold-500/5">
                  <td className="px-6 py-4 whitespace-nowrap">{task.task}</td>
                  <td className="px-6 py-4">{task.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{task.reward}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{task.platform}</td>
                  <td className="px-6 py-4 whitespace-nowrap uppercase">{task.verificationMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
    </div>
  );
};

export default Tasks;