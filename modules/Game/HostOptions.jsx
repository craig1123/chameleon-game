import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
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
  const { gridSelect } = gameState;
  const { inProgress, pointsForGuessing, chameleonSeeClues, privateRoom, anonymousVoting } = roomState;
  const totalScore = players.reduce((prev, cur) => prev + roomState.players[cur], 0);
  const playedMoreThanOneRound = totalScore > 0;

  const startGame = () => {
    socket.emit('startGame');
  };

  const resetScores = () => {
    socket.emit('resetScores');
  };

  const kickPlayer = (playerName) => () => {
    socket.emit('kickPlayer', playerName);
  };

  const changeGrid = (e) => {
    socket.emit('changeGrid', e.target.value);
  };

  const changeHostOption = (e) => {
    socket.emit('changeRoomOptions', { name: e.target.name, value: e.target.checked });
  };

  return (
    <section className={styles['host-options']}>
      <h4 className="marker">Host Options</h4>
      <Row>
        <Col>
          <Button type="button" onClick={startGame} disabled={inProgress || players.length < 3}>
            {playedMoreThanOneRound ? 'Next Round' : 'Start Game'}
          </Button>
        </Col>
        <Col>
          <Button type="button" onClick={resetScores}>
            Reset Scores
          </Button>
        </Col>
      </Row>
      <br />
      <br />
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Row>
          <Form.Group as={Col} controlId="gridBoard">
            <Form.Control as="select" value={gridSelect} onChange={changeGrid} name="gridSelect" disabled={inProgress}>
              <option value="random">Random Board</option>
              {differentClueBoards.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="privateRoom">
            <Form.Check
              label="Private Game"
              name="privateRoom"
              onChange={changeHostOption}
              disabled={inProgress}
              checked={privateRoom}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="pointsForGuessing">
            <Form.Check
              name="pointsForGuessing"
              disabled={inProgress}
              onChange={changeHostOption}
              checked={pointsForGuessing}
              label="1 point for guessing chameleon"
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="chameleonSeeClues">
            <Form.Check
              checked={chameleonSeeClues}
              onChange={changeHostOption}
              name="chameleonSeeClues"
              label="Chameleon can see one random player's clue"
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="anonymousVoting">
            <Form.Check
              label="Anonymous Voting"
              name="anonymousVoting"
              onChange={changeHostOption}
              checked={anonymousVoting}
            />
          </Form.Group>
        </Form.Row>
      </Form>
      <h5 className="marker">Click on player to kick:</h5>
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
