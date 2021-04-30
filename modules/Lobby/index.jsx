import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';
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
  const joinAGameArray = roomsArray.filter((roomId) => !rooms[roomId]?.inProgress && !rooms[roomId]?.full);
  const inProgressGames = roomsArray.filter((roomId) => rooms[roomId]?.inProgress);

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
      <Container className={styles['lobby-wrapper']}>
        <h3 className="h1">{username}</h3>
        <div className={styles['host-game']}>
          <Button onClick={hostRoom}>Host Game</Button>
        </div>
        {roomsArray.length > 0 ? (
          <>
            <h3>Join a Game</h3>
            <div className={styles.grid}>
              {joinAGameArray.map((roomId) => (
                <Room key={roomId} roomId={roomId} room={rooms[roomId]} />
              ))}
            </div>
            <br />
            <h3>Games in Progress</h3>
            <div className={styles.grid}>
              {inProgressGames.map((roomId) => (
                <Room key={roomId} roomId={roomId} room={rooms[roomId]} />
              ))}
            </div>
          </>
        ) : (
          <Alert variant="warning">There are no games. Host one :)</Alert>
        )}
      </Container>
    </>
  );
};

export default Lobby;
