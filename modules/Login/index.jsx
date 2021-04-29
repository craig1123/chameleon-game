import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { getLocalStorageItem } from '../../hooks/useLocalStorage';
import useSocket from '../../hooks/useSocket';
import Cookies from 'js-cookie';

const wrapper = {
  backgroundColor: 'rgb(227, 226, 108)',
  marginTop: '50px',
  padding: '20px',
};

const Login = ({ socket }) => {
  const [name, setName] = useState(() => Cookies.get('playerName') || '');
  const [errorName, setErrorName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('requestuser', name);
  };

  useEffect(() => {
    if (socket) {
      socket.emit('removePlayer');
    }
  }, [socket]);

  useSocket(socket, 'signUpError', (error) => {
    setErrorName(error);
  });

  return (
    <Container style={wrapper}>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="login-name">
          <Form.Label>Username</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            size="lg"
            required
            placeholder="Please provide a name"
          />
          {errorName && <Form.Text>{errorName}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="primary" size="large">
          Enter Lobby
        </Button>
      </Form>
      {/* Todo: put disclaimer below */}
    </Container>
  );
};

export default Login;
