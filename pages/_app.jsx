import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';

import { pageview } from '../utils/ga';

import '../styles/global.scss';
import { PlayerProvider } from '../context/player';

const MyApp = ({ pageProps, Component }) => {
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <PlayerProvider socket={socket}>
      <Component {...pageProps} socket={socket} />
    </PlayerProvider>
  );
};

export default MyApp;
