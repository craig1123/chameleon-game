import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import useSocket from '../../hooks/useSocket';
import Cookies from 'js-cookie';

import Clock from '../SVG/Clock';
import Players from '../SVG/Players';
import RecommendedAge from '../SVG/Age';

const wrapper = {
  backgroundColor: 'rgb(227, 226, 108)',
  marginTop: '50px',
  padding: '20px',
};
const svgStyles = {
  height: '100px',
  width: '100px',
};
const svgWrapper = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
};
const svgWrapperWrapper = {
  display: 'flex',
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
        <div style={svgWrapperWrapper}>
          <div style={svgWrapper}>
            <Clock style={svgStyles} />
            <p>15 mins</p>
          </div>
          <div style={svgWrapper}>
            <Players style={svgStyles} />
            <p>3 - 10 Players</p>
          </div>
          <div style={svgWrapper}>
            <RecommendedAge style={svgStyles} />
            <p>Age 14+</p>
          </div>
          <div style={svgWrapper}>
            <span style={svgStyles} />
            <a
              href="https://www.youtube.com/watch?v=3IEEUcG0nSo"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to play?
            </a>
          </div>
          <div style={svgWrapper}>
            <span style={svgStyles} />
            <a href="/the-chameleon-rules.pdf" target="_blank" rel="noopener noreferrer">
              PDF rules
            </a>
          </div>
        </div>
      </Form>
      {/* Todo: put disclaimer below */}
    </Container>
  );
};

export default Login;
