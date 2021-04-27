import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

export default function useSocket(eventName, cb) {
  useEffect(() => {
    socket.on(eventName, cb);

    return () => {
      socket.off(eventName, cb);
    };
  }, [eventName, cb]);

  return socket;
}
