import { useEffect } from 'react';

export default function useSocket(socket, eventName, cb) {
  useEffect(() => {
    if (!socket) {
      return () => {};
    }

    socket.on(eventName, cb);

    return () => {
      socket.off(eventName, cb);
    };
  }, [socket, eventName, cb]);

  return socket;
}
