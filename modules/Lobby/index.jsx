import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import useSocket from '../../hooks/useSocket';
import Login from './Login';

import styles from './lobby.module.scss';

const Lobby = () => {
  const [metaState, setMetaState] = useState(() => ({}));
  const { username, usersOnline, rooms } = metaState;

  const socket = useSocket('acceptuser', (userState) => {
    console.log(userState);
    localStorage.setItem('userName', JSON.stringify(userState.username));
    setMetaState((prev) => ({ ...prev, ...userState }));
  });

  const heading = (
    <Row className={styles['title-div']}>
      <Col sm={6} md={4}>
        <h1 className="title">Chameleon</h1>
        {usersOnline && <p>Users Online: {usersOnline}</p>}
      </Col>
      <Col sm={6}>
        <Image height="128" width="128" src="/chameleon.png" className="logo" />
      </Col>
    </Row>
  );

  if (!username) {
    return (
      <Container>
        {heading}
        <hr />
        <Login socket={socket} />
      </Container>
    );
  }

  const roomsArray = Object.keys(rooms);

  return (
    <Container>
      {heading}
      <hr />
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
  );
};

export default Lobby;
