import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import useSocket from '../../hooks/useSocket';
import Cookies from 'js-cookie';

import Clock from '../SVG/Clock';
import Players from '../SVG/Players';
import RecommendedAge from '../SVG/Age';

import styles from './login.module.scss';

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
    <Container className={styles.wrapper}>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="login-name">
          <Form.Label>Player Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            size="lg"
            required
            placeholder="Please provide a name"
            maxLength="20"
          />
          {errorName && <Form.Text>{errorName}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="primary" size="large">
          Enter Lobby
        </Button>
        <div className={styles.svgContainer}>
          <div className={styles.svgWrapper}>
            <Clock />
            <p>15 mins</p>
          </div>
          <div className={styles.svgWrapper}>
            <Players className={styles.svg} />
            <p>3 - 12 Players</p>
          </div>
          <div className={styles.svgWrapper}>
            <RecommendedAge className={styles.svg} />
            <p>Age 14+</p>
          </div>
        </div>
      </Form>
      <a href="https://www.youtube.com/watch?v=3IEEUcG0nSo" target="_blank" rel="noopener noreferrer">
        How to play?
      </a>
      <br />
      <a href="/the-chameleon-rules.pdf" target="_blank" rel="noopener noreferrer">
        PDF of the rules
      </a>
      <br />
      <a href="https://bigpotato.com/products/the-chameleon" target="_blank" rel="noopener noreferrer">
        Official Game Website
      </a>
      <section>
        <h2>Disclaimer</h2>
        <p>
          This is a non-profit project made by a Craigular Joe and some friends out of pure love for the original game.
          It is an adaptation of The Chameleon and provides ease of play/access while maintaining the overall idea. The
          project is not affiliated with any of the official publishers of The Chameleon in any way. Check out the
          official website here{' '}
          <a href="https://bigpotato.com/products/the-chameleon" target="_blank" rel="noopener noreferrer">
            https://bigpotato.com/products/the-chameleon
          </a>
          . If you are the official publishers, please get in touch with us as we would love to further advance the game
          with you :)
        </p>
      </section>
    </Container>
  );
};

export default Login;
