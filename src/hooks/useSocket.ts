import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../lib/axios';

interface UseSocketProps {
  userId: string;
  onNotification?: (message: any) => void;
  onLeaderboardChange?: (data: any) => void;
}

export const useSocket = ({ userId, onNotification, onLeaderboardChange }: UseSocketProps) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Get the base URL from the API configuration
    const baseURL = api.defaults.baseURL;
    if (!baseURL) return;

    // Create socket connection
    socketRef.current = io(baseURL, {
      query: { userId },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Set up event listeners
    const socket = socketRef.current;

    if (onNotification) {
      socket.on('notification', onNotification);
    }

    if (onLeaderboardChange) {
      socket.on('leaderboard_update', onLeaderboardChange);
    }

    // Handle connection events
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Cleanup function
    return () => {
      if (socket) {
        socket.off('notification');
        socket.off('leaderboard_update');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('error');
        socket.disconnect();
      }
    };
  }, [userId, onNotification, onLeaderboardChange]);

  // Function to emit events
  const emitEvent = useCallback((eventName: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(eventName, data);
    } else {
      console.warn('Socket is not connected');
    }
  }, []);

  return {
    emitEvent,
    isConnected: socketRef.current?.connected || false,
  };
}; 