import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Toast from 'react-bootstrap/Toast';
import useSocket from '../../hooks/useSocket';
import Toasts from './Toasts';
import HostGame from './HostGame';
import Room from './Room';

import styles from './lobby.module.scss';
import { usePlayer } from '../../context/player';

const Lobby = ({ socket, roomsObj, playerName }) => {
  const router = useRouter();
  const [rooms, setRooms] = useState(roomsObj);
  const [showHostModal, setShowHostModal] = useState(false);
  const { playerState } = usePlayer();
  const { playersOnline, connected } = playerState;

  useEffect(() => {
    if (socket && playersOnline === 0) {
      socket.emit('requestuser', playerName);
    }
  }, [socket, playerName, playersOnline]);

  useSocket(socket, 'acceptHost', (roomId) => {
    router.push(`/room/${roomId}`);
  });
  useSocket(socket, 'roomFull', (moreRooms) => {
    setRooms(moreRooms);
  });

  const hostGame = () => {
    setShowHostModal(true);
  };

  const roomsArray = roomsObj ? Object.keys(roomsObj) : [];
  const joinAGameArray = roomsArray.filter((roomId) => !roomsObj[roomId]?.inProgress && !roomsObj[roomId]?.full);
  const inProgressGames = roomsArray.filter((roomId) => roomsObj[roomId]?.inProgress);

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
        <Toasts socket={socket} />
      </header>
      <Container className={styles['lobby-wrapper']}>
        <h3 className="h1">{playerName}</h3>
        <div className={styles['host-game']}>
          <Button onClick={hostGame}>Host Game</Button>
          <HostGame show={showHostModal} onHide={() => setShowHostModal(false)} socket={socket} />
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
