import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import useSocket from '../../hooks/useSocket';
import Header from '../Header';
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
  const { playersOnline } = playerState;

  useEffect(() => {
    if (socket && playersOnline === 0) {
      socket.emit('requestuser', playerName);
    }
  }, [socket, playerName, playersOnline]);

  useSocket(socket, 'acceptJoinGame', (roomId) => {
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
      <Header />
      <Toasts socket={socket} />
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
                <Room key={roomId} roomId={roomId} room={rooms[roomId]} socket={socket} />
              ))}
            </div>
            <br />
            <h3>Games in Progress</h3>
            <div className={styles.grid}>
              {inProgressGames.map((roomId) => (
                <Room key={roomId} roomId={roomId} room={rooms[roomId]} socket={socket} />
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
