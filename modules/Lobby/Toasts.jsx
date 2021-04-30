import React, { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import useSocket from '../../hooks/useSocket';

const Lobby = ({ socket, setRooms }) => {
  const [showToast, setShowToast] = useState(false);

  useSocket(socket, 'roomFull', (moreRooms) => {
    setShowToast(true);
    setRooms(moreRooms);
  });

  return (
    <Toast
      autohide
      animation
      delay={3000}
      show={showToast}
      onClose={() => setShowToast(false)}
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
      }}
    >
      <Toast.Header>
        <strong className="mr-auto">Error</strong>
      </Toast.Header>
      <Toast.Body>The room you requested is full</Toast.Body>
    </Toast>
  );
};

export default Lobby;
