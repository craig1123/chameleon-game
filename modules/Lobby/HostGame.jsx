import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const makeRoomId = () => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < 4; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const HostGame = ({ onHide, show, socket }) => {
  const [loading, setLoading] = useState(false);
  const hostRoom = () => {
    setLoading(true);
    socket.emit('requestRoom', makeRoomId());
  };

  const onClose = () => {
    setLoading(false);
    onHide();
  };

  return (
    <Modal onHide={onClose} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Host Preferences</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
          Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={loading} onClick={hostRoom}>
          {loading ? 'Setting up game...' : 'Host Game'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HostGame;
