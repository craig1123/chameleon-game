import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import useSocket from '../../hooks/useSocket';
import Login from './Login';

import styles from './lobby.module.scss';

const Lobby = ({ socket }) => {
  const [metaState, setMetaState] = useState(() => ({ connected: false, usersOnline: 0 }));
  const { username, usersOnline, rooms, connected } = metaState;

  useSocket(socket, 'acceptuser', (userState) => {
    localStorage.setItem('userName', JSON.stringify(userState.username));
    setMetaState((prev) => ({ ...prev, ...userState }));
  });

  useSocket(socket, 'connected', (userState) => {
    setMetaState((prev) => ({ ...prev, ...userState }));
  });

  if (!username) {
    return (
      <Container className={styles.wrapper}>
        <Login socket={socket} />
      </Container>
    );
  }

  const roomsArray = Object.keys(rooms);

  return (
    <>
      <div className={styles['header-fill']} />
      <header className={styles.header}>
        <div className={styles['header-col']}>
          <div className={styles['header-connection']}>
            <span className={styles['connection-label']}>Connection: </span>
            <span className={styles.circle} style={{ background: connected ? '#67c23a' : '#f56c6c' }}></span>
            <span className={styles['header-separator']}></span>
            <span className={styles['connection-label']}>Users online: {usersOnline}</span>
          </div>
        </div>
      </header>
      <Container className={styles.wrapper}>
        <h4>Username: {username}</h4>
        {roomsArray.length > 0 ? (
          <CardColumns>
            {roomsArray.map((roomId) => {
              const room = rooms[roomId];
              return (
                <Card bg="secondary" key={roomId} style={{ width: '18rem' }} className="mb-2">
                  <Card.Header>Room id: {roomId}</Card.Header>
                  <Card.Body>
                    <Card.Text>Host: {room.host}</Card.Text>
                    <Card.Text>Players: {Object.keys(room.players).join(', ')}</Card.Text>
                    <Link href={room.inProgress || room.full ? '/' : `/room/${roomId}`}>
                      <Button disabled={room.inProgress || room.full} variant="primary">
                        Join
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>
        ) : (
          'There are no active games'
        )}
      </Container>
    </>
  );
};

export default Lobby;
