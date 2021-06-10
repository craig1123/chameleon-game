import React, { memo } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PrivateSignup from './PrivateSignup';

const cardStyles = { width: '18rem', margin: '20px 10px', color: 'white' };

function getStatus(room) {
  const { full, inProgress, privateRoom } = room;
  if (full) {
    return 'Full';
  } else if (inProgress) {
    return 'In Progress';
  } else if (privateRoom) {
    return 'Private and Waiting';
  }

  return 'Waiting';
}

const Room = ({ room, roomId, socket }) => {
  const { host, full, inProgress, players, privateRoom } = room;
  const joinGame = () => {
    socket.emit('requestRoom', { requestedRoom: roomId });
  };
  return (
    <Card bg="primary" style={cardStyles} className="mb-2">
      <Card.Header>Host: {host}</Card.Header>
      <Card.Body>
        <Card.Text>Players: {players && Object.keys(players).join(', ')}</Card.Text>
        <Card.Text>Status: {getStatus(room)}</Card.Text>
        {privateRoom && <PrivateSignup roomId={roomId} socket={socket} />}
        {full || inProgress || privateRoom ? null : (
          <Button variant="secondary" onClick={joinGame}>
            Join Game
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default memo(Room);
