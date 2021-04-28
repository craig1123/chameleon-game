import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getLocalStorageItem } from '../../hooks/useLocalStorage';
import useSocket from '../../hooks/useSocket';

const Login = ({ socket }) => {
  const [name, setName] = useState(() => getLocalStorageItem('userName', ''));
  const [errorName, setErrorName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('requestuser', name);
  };

  useSocket(socket, 'signUpError', (error) => {
    setErrorName(error);
  });

  return (
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
  );
};

export default Login;
