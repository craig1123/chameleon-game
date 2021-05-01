import React from 'react';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import wordSheet from '../../consts/wordSheet';

const differentClueBoards = Object.keys(wordSheet);

/**
 * start game/start round
 * kick player
 * change settings like board, etc
 * Can't change settings while a game is in progress.
 * In Progress goes to false everytime the round is over
 */
const HostOptions = ({ socket, roomState, gameState }) => {
  const { gridTitle } = gameState;
  const { inProgress } = roomState;

  const startGame = () => {
    socket.emit('startGame');
  };

  return (
    <div>
      <Form>
        <Form.Row>
          <Form.Group as={Col} controlId="gridBoard">
            <Form.Label>Clue Boards</Form.Label>
            <Form.Control as="select" defaultValue={gridTitle} name="gameTitle" disabled={inProgress}>
              <option value="random">Random Board</option>
              {differentClueBoards.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Button onClick={startGame}>Start Game</Button>
      </Form>
    </div>
  );
};

export default HostOptions;
