import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { usePlayer } from '../../context/player';
import Ellipsis from '../Ellipsis';
import CountdownGrid from './CountdownGrid';

import styles from './game.module.scss';

const getClue = (gameState) => {
  const firstUsername = Cookies.get('playerName') || '';
  return gameState.players?.[firstUsername]?.clue || '';
};

const PlayerOptions = ({ socket, gameState, roomState, players, allCluesReady, isChameleon }) => {
  const { playerState } = usePlayer();
  const { username } = playerState;
  const { inProgress, chameleonSeeClues, clueTimer } = roomState;
  const [clue, setClue] = useState(() => getClue(gameState));
  const playerOptions = players.filter((player) => player !== username);
  const clueReady = gameState.players?.[username]?.clueReady || false;
  const showCountDown = clueTimer && !allCluesReady && inProgress;

  useEffect(() => {
    if (inProgress) {
      setClue(gameState.players?.[username]?.clue || '');
    }
  }, [inProgress]);

  const handleClueChange = (e) => {
    const value = e.target.value;
    setClue(value);
    if (chameleonSeeClues && gameState.playerShowsClue === username) {
      socket.emit('updatePlayerOption', [{ optionName: 'clue', value: value }]);
    }
  };

  const handleClueReady = (e) => {
    socket.emit('updatePlayerOption', [
      { optionName: 'clueReady', value: e.target.checked },
      { optionName: 'clue', value: clue },
    ]);
  };

  const selectVote = (e) => {
    socket.emit('updateVote', e.target.value);
  };

  const timeUp = () => {
    if (!clueReady) {
      socket.emit('updatePlayerOption', [
        { optionName: 'clueReady', value: true },
        { optionName: 'clue', value: clue || 'Time ran out on me.' },
      ]);
    }
  };

  if (gameState.boardIsClickable) {
    return (
      <div className={styles['player-options']}>
        <Alert style={{ color: 'rgb(50, 115, 153)' }}>
          <h2>
            {isChameleon ? 'Guess a word in the grid' : 'Chameleon is guessing a word'}
            <Ellipsis />
          </h2>
        </Alert>
      </div>
    );
  }

  if (!inProgress) {
    return (
      <div className={styles['player-options']}>
        <Alert style={{ color: 'rgb(50, 115, 153)' }}>
          <h2>
            Waiting for host to start game
            <Ellipsis />
          </h2>
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles['player-options']}>
      {showCountDown && <CountdownGrid timeUp={timeUp} timer={60} />}
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Row>
          <Form.Group as={Col} md="4" controlId="clue">
            <Form.Label>Word Clue</Form.Label>
            <Form.Control value={clue} disabled={allCluesReady || clueReady} name="clue" onChange={handleClueChange} />
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="clueReady">
            <Form.Label />
            <Form.Check
              onChange={handleClueReady}
              checked={clueReady}
              type="switch"
              label="Clue Ready?"
              name="clueReady"
              disabled={allCluesReady}
            />
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="vote">
            <Form.Label>Vote</Form.Label>
            <Form.Control
              as="select"
              value={gameState.players?.[username]?.vote || ''}
              onChange={selectVote}
              disabled={!allCluesReady}
              name="vote"
            >
              <option value="" disabled>
                {allCluesReady ? 'Select the chameleon' : 'Waiting for all clues'}
              </option>
              {playerOptions.map((player) => (
                <option value={player} key={player}>
                  {player}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default PlayerOptions;
