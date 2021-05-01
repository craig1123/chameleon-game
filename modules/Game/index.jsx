import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import useSocket from '../../hooks/useSocket';
import { usePlayer } from '../../context/player';
import GridOfWords from './GridOfWords';

const Game = ({ socket, activeGame, room }) => {
  const router = useRouter();
  const { playerState } = usePlayer();
  const [roomState, setRoomState] = useState(room);
  const [gameState, setGameState] = useState(activeGame);

  useEffect(() => {
    return () => {
      socket.emit('leaveRoom');
    };
  }, []);

  useSocket(socket, 'updateRoom', (state) => {
    console.log(state);
  });

  const leaveRoom = () => {
    router.push('/lobby');
  };

  const isChameleon = playerState.userName === gameState.chameleon;

  return (
    <Container>
      <GridOfWords gameState={gameState} isChameleon={isChameleon} />

      {/* <div id="game-div">
        <hr />
        <Row>
          <div className="col-12" id="room-indicator"></div>
          <div className="col-12" id="user-indicator"></div>
          <div className="col-12">
            <button onClick={leaveRoom} id="leave" className="box">
              Leave room
            </button>
          </div>
        </Row>
        <hr />
        <Row className="controls">
          <div className="col-6">
            <button id="change-grid" className="box">
              Reset grid
            </button>
          </div>
          <div className="col-6">
            <button id="assign-roles" className="box">
              Assign roles
            </button>
          </div>
        </Row>
        <hr />
        <Row>
          <div className="col-6" id="roleholder">
            <strong id="role">Role unassigned</strong>
          </div>
          <div className="col-6">
            <button id="hide-role" className="box">
              Toggle
            </button>
          </div>
        </Row>
        <hr />
      </div> */}
    </Container>
  );
};

export default Game;
