import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import '../styles/global.scss';
import { PlayerProvider } from '../context/player';

const MyApp = ({ pageProps, Component }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <PlayerProvider socket={socket}>
      <Component {...pageProps} socket={socket} />
    </PlayerProvider>
  );
};

export default MyApp;
