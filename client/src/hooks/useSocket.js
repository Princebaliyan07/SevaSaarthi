import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * Real-time incident updates.
 * Connects only when VITE_SOCKET_URL is set (e.g. http://localhost:5000), so the
 * frontend runs fine on mock data before the backend exists.
 *
 * Usage: const { connected } = useSocket({ 'incident:update': (data) => ... });
 */
export default function useSocket(handlers = {}) {
  const url = import.meta.env.VITE_SOCKET_URL;
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!url) return undefined;
    const socket = io(url, { transports: ['websocket'], reconnectionAttempts: 5 });
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    Object.keys(handlersRef.current).forEach((evt) => {
      socket.on(evt, (payload) => handlersRef.current[evt]?.(payload));
    });
    return () => socket.disconnect();
  }, [url]);

  return { connected, enabled: !!url };
}
