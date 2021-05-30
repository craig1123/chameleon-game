import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useSocket from '../hooks/useSocket';

const PlayerContext = React.createContext({ connected: false, playersOnline: [], username: '' });

export const PlayerProvider = ({ children, socket }) => {
  const router = useRouter();
  const [playerState, setPlayerState] = useState(() => ({
    connected: false,
    playersOnline: [],
    username: Cookies.get('playerName') || '',
  }));

  useSocket(socket, 'connected', (userState) => {
    setPlayerState((prev) => ({ ...prev, ...userState }));
  });

  useSocket(socket, 'acceptuser', (userState) => {
    Cookies.set('playerName', userState.username, { expires: 365 });
    setPlayerState((prev) => ({ ...prev, ...userState }));
    if (router.route !== '/lobby') {
      router.push('/lobby');
    }
  });

  useSocket(socket, 'signUpError', (error) => {
    if (router.route !== '/') {
      router.push('/');
    }
  });

  const value = { playerState, setPlayerState };
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = React.useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
