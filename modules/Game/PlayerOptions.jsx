import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { usePlayer } from '../../context/player';

import styles from './game.module.scss';

const PlayerOptions = ({ socket, gameState, roomState, players, allCluesReady }) => {
  const { playerState } = usePlayer();
  const { username } = playerState;
  const { inProgress, chameleonSeeClues } = roomState;
  const [clue, setClue] = useState(() => gameState.players?.[username]?.clue || '');
  const playerOptions = players.filter((player) => player !== username);
  const clueReady = gameState.players?.[username]?.clueReady || false;

  useEffect(() => {
    if (inProgress) {
      setClue('');
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

  if (!inProgress) {
    return (
      <div className={styles['player-options']}>
        <Alert style={{ color: 'rgb(50, 115, 153)', textDecoration: 'underline' }}>
          <h2>Waiting for host to start game...</h2>
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles['player-options']}>
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
                {allCluesReady ? 'Please select a player' : 'Waiting for all clues'}
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
