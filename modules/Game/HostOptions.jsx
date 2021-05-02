import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import wordSheet from '../../consts/wordSheet';

import styles from './game.module.scss';

const differentClueBoards = Object.keys(wordSheet);

/**
 * start game/start round
 * kick player
 * change settings like board, etc
 * Can't change settings while a game is in progress.
 * In Progress goes to false everytime the round is over
 */
const HostOptions = ({ socket, roomState, gameState, players }) => {
  const { gridTitle } = gameState;
  const { inProgress } = roomState;

  const startGame = () => {
    socket.emit('startGame');
  };

  const kickPlayer = (playerName) => () => {
    socket.emit('kickPlayer', playerName);
  };

  const changeGrid = (e) => {
    socket.emit('changeGrid', e.target.value);
  };

  return (
    <section className={styles['host-options']}>
      <h4>Host Options</h4>
      <div>
        Players:{' '}
        {players.map((player) => (
          <div onClick={kickPlayer(player)} key={player} title="Kick Player" style={{ cursor: 'pointer' }}>
            {player} X
          </div>
        ))}
      </div>
      <Form>
        <Form.Row>
          <Form.Group as={Col} controlId="gridBoard">
            <Form.Control as="select" value={gridTitle} onChange={changeGrid} name="gameTitle" disabled={inProgress}>
              <option value="random">Random Board</option>
              {differentClueBoards.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Button onClick={startGame} disabled={inProgress || players.length < 3}>
          Start Game
        </Button>
      </Form>
    </section>
  );
};

export default HostOptions;
