import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import useSocket from '../../hooks/useSocket';
import Login from './Login';

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
              const room = rooms[roomId];
              const { host, full, inProgress, players } = room;
              return (
                <Card
                  bg={'primary'}
                  key={roomId}
                  style={{ width: '18rem', margin: '20px 10px', color: 'white' }}
                  className="mb-2"
                >
                  <Card.Header>Host: {host}</Card.Header>
                  <Card.Body>
                    <Card.Text>Players: {Object.keys(players).join(', ')}</Card.Text>
                    <Card.Text>Status: {full ? 'Full' : inProgress ? 'In Progress' : 'Waiting'}</Card.Text>
                    {full || inProgress ? null : (
                      <Link href={`/room/${roomId}`}>
                        <Button variant="secondary">Join Game</Button>
                      </Link>
                    )}
                  </Card.Body>
                </Card>
              );
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
