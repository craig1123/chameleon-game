import React, { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import FormText from 'react-bootstrap/FormText';
import Button from 'react-bootstrap/Button';

const PrivateSignup = ({ roomId, socket }) => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const verifySubmit = () => {
    if (id.toLowerCase() === roomId.toLowerCase()) {
      socket.emit('requestRoom', { requestedRoom: roomId });
    } else {
      setError('Incorrect game id');
    }
  };

  return (
    <>
      <InputGroup className="mb-3">
        <FormControl
          onChange={(e) => setId(e.target.value)}
          placeholder="Type in game id"
          aria-label="Game ID"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Append>
          <Button onClick={verifySubmit} variant="secondary">
            Join Game
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {error && <FormText style={{ color: 'black' }}>{error}</FormText>}
    </>
  );
};

export default PrivateSignup;
