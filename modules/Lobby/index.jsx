import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import useSocket from '../../hooks/useSocket';
import Room from './Room';

import styles from './lobby.module.scss';
import { usePlayer } from '../../context/player';

const makeRoomId = () => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < 4; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const Lobby = ({ socket, rooms }) => {
  const router = useRouter();
  const { playerState } = usePlayer();
  const { username, playersOnline, connected } = playerState;

  useEffect(() => {
    if (socket && playersOnline === 0) {
      socket.emit('requestuser', username);
    }
  }, [socket, username, playersOnline]);

  useSocket(socket, 'acceptHost', (roomId) => {
    router.push(`/room/${roomId}`);
  });

  const hostRoom = () => {
    socket.emit('requestRoom', makeRoomId());
  };

  const roomsArray = rooms ? Object.keys(rooms) : [];

  return (
    <>
      <div className={styles['header-fill']} />
      <header className={styles.header}>
        <div className={styles['header-col']}>
          <div className={styles['header-connection']}>
            <span className={styles['connection-label']}>Connection: </span>
            <span className={styles.circle} style={{ background: connected ? '#67c23a' : '#f56c6c' }}></span>
            <span className={styles['header-separator']}></span>
            <span className={styles['connection-label']}>Players online: {playersOnline}</span>
          </div>
        </div>
      </header>
      <Container>
        <h4>Username: {username}</h4>
        <Button onClick={hostRoom}>Host Game</Button>
        {roomsArray.length > 0 ? (
          <div className={styles.grid}>
            {/* TODO: split up active games with games waiting */}
            {roomsArray.map((roomId, i) => {
              return <Room key={roomId} roomId={roomId} room={rooms[roomId]} />;
            })}
          </div>
        ) : (
          'There are no active games'
        )}
      </Container>
    </>
  );
};

export default Lobby;
