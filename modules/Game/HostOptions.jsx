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
      <h4 className="marker">Host Options</h4>
      <Button onClick={startGame} disabled={inProgress || players.length < 3}>
        Start Game
      </Button>
      <br />
      <br />
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
      </Form>
      <h5>Click on player to kick:</h5>
      <div className={styles['kick-players']}>
        {players.map((player) => (
          <div onClick={kickPlayer(player)} key={player} className={styles['player-to-kick']}>
            {player}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HostOptions;
