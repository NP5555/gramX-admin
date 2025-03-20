import React, { useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import toast from 'react-hot-toast';

interface SocketExampleProps {
  userId: string;
}

const SocketExample: React.FC<SocketExampleProps> = ({ userId }) => {
  // Handle notifications
  const handleNotification = useCallback((message: any) => {
    toast(message.text, {
      icon: message.type === 'success' ? '🎉' : '📢',
    });
  }, []);

  // Handle leaderboard updates
  const handleLeaderboardChange = useCallback((data: any) => {
    if (data.type === 'stats_update') {
      console.log('Stats updated:', data.stats);
      // Update your local state/UI here
    } else if (data.type === 'visibility_change') {
      console.log('Visibility changed:', data.visibility);
      // Handle visibility changes
    }
  }, []);

  // Initialize socket connection
  const { emitEvent, isConnected } = useSocket({
    userId,
    onNotification: handleNotification,
    onLeaderboardChange: handleLeaderboardChange,
  });

  // Example function to emit a custom event
  const handleSendCustomEvent = () => {
    emitEvent('custom_event', {
      userId,
      data: 'Some custom data',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="p-4 border border-gold-500/20 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-400">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <button
        onClick={handleSendCustomEvent}
        className="bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors"
        disabled={!isConnected}
      >
        Send Custom Event
      </button>
    </div>
  );
};

export default SocketExample; 