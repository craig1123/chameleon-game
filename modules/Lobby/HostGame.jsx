import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import wordSheet from '../../consts/wordSheet';
import * as ga from '../../utils/ga';

const differentClueBoards = Object.keys(wordSheet);

export const makeRoomId = () => {
  const possible = 'abcdefghijklmnopqrstuvwxyz';
  let text = '';

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const HostGame = ({ onHide, show, socket }) => {
  const [loading, setLoading] = useState(false);
  const hostRoom = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const preferences = {
      requestedRoom: makeRoomId(),
      gridSelect: formData.get('gridSelect'),
      privateRoom: formData.get('privateRoom') === 'on',
      chameleonSeeClues: formData.get('chameleonSeeClues') === 'on',
      pointsForGuessing: formData.get('pointsForGuessing') === 'on',
      anonymousVoting: formData.get('anonymousVoting') === 'on',
      clueTimer: formData.get('clueTimer') === 'on',
    };
    ga.event({
      action: 'host',
      params: preferences,
    });
    socket.emit('requestRoom', preferences);
  };

  const onClose = () => {
    setLoading(false);
    onHide();
  };

  return (
    <Modal onHide={onClose} show={show} animation={false} size="md" aria-labelledby="host-preferences-title" centered>
      <Modal.Header closeButton>
        <Modal.Title id="host-preferences-title">Game Preferences</Modal.Title>
      </Modal.Header>
      <Form onSubmit={hostRoom}>
        <Modal.Body>
          <Form.Row>
            <Form.Group as={Col} controlId="gridBoard">
              <Form.Label>Clue Boards</Form.Label>
              <Form.Control as="select" defaultValue="Random Board" name="gridSelect">
                <option value="random">Random Board</option>
                {differentClueBoards.map((gridTitle) => (
                  <option key={gridTitle} value={gridTitle}>
                    {gridTitle}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <Form.Group as={Row} controlId="privateRoom">
            <Col>
              <Form.Check label="Private Game" name="privateRoom" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="chameleonSeeClues">
            <Col>
              <Form.Check defaultChecked name="chameleonSeeClues" label="Chameleon can see one random player's clue" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="pointsForGuessing">
            <Col>
              <Form.Check
                name="pointsForGuessing"
                defaultChecked
                label="Player gets 1 point for guessing chameleon when not in majority"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="anonymousVoting">
            <Col>
              <Form.Check name="anonymousVoting" label="Anonymous Voting" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="clueTimer">
            <Col>
              <Form.Check name="clueTimer" label="Add a 1 min timer when adding a clue" />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} type="submit">
            {loading ? 'Setting up game...' : 'Host Game'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default HostGame;
