import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import useSocket from '../../hooks/useSocket';
import Login from './Login';
import Room from './Room';

import styles from './lobby.module.scss';

const Lobby = ({ socket }) => {
  const [metaState, setMetaState] = useState(() => ({ connected: false, playersOnline: 0 }));
  const { username, playersOnline, rooms, connected } = metaState;

  useSocket(socket, 'acceptuser', (userState) => {
    localStorage.setItem('userName', JSON.stringify(userState.username));
    setMetaState((prev) => ({ ...prev, ...userState }));
  });

  useSocket(socket, 'connected', (userState) => {
    setMetaState((prev) => ({ ...prev, ...userState }));
  });

  if (!username) {
    return (
      <Container className={styles['login-wrapper']}>
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
            <span className={styles['connection-label']}>Players online: {playersOnline}</span>
          </div>
        </div>
      </header>
      <Container>
        <h4>Username: {username}</h4>
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
