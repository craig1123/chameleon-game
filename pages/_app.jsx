import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.scss';

const MyApp = ({ pageProps, Component }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return <Component {...pageProps} socket={socket} />;
};

export default MyApp;
