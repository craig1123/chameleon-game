import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import useSocket from '../../hooks/useSocket';
import Header from '../Header';
import Toasts from '../Toasts';
import HostGame from './HostGame';
import Room from './Room';

import styles from './lobby.module.scss';

const Lobby = ({ socket, roomsObj, playerName }) => {
  const router = useRouter();
  const [rooms, setRooms] = useState(roomsObj);
  const [showHostModal, setShowHostModal] = useState(false);

  useSocket(socket, 'acceptJoinGame', (roomId) => {
    router.push(`/room/${roomId}`);
  });

  useSocket(socket, 'moreRooms', (moreRooms) => {
    setRooms(moreRooms);
  });

  const hostGame = () => {
    setShowHostModal(true);
  };

  const roomsArray = rooms ? Object.keys(rooms) : [];
  const joinAGameArray = roomsArray.filter((roomId) => !rooms[roomId]?.inProgress && !rooms[roomId]?.full);
  const inProgressGames = roomsArray.filter((roomId) => rooms[roomId]?.inProgress);

  return (
    <>
      <Header showConnection showPlayersOnline />
      <Toasts socket={socket} callback={setRooms} />
      <Container className={styles['lobby-wrapper']}>
        <h3 className="h1">
          {playerName}{' '}
          <Link href="/">
            <a onClick={() => Cookies.remove('playerName')}>&#9998;</a>
          </Link>
        </h3>
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
