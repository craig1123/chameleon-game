import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import useSocket from '../../hooks/useSocket';
import { usePlayer } from '../../context/player';

const Game = ({ socket, grid, room }) => {
  const router = useRouter();
  const { playerState } = usePlayer();
  const [roomState, setRoomState] = useState(room);
  const [gameState, setGameState] = useState(grid);

  useSocket(socket, 'updateonline', (state) => {
    console.log(state);
  });

  const leaveRoom = () => {
    router.push('/lobby');
  };

  const isChameleon = playerState.userName === gameState.chameleon;
  const letters = ['A', 'B', 'C', 'D'];
  const gameColumns = [1, 2, 3, 4, 5, 6];
  const gameRows = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <Container>
      {isChameleon ? (
        <Row id="title-div">
          <div className="col-12">
            <h1 id="title">You are the Chameleon</h1>
            <img src="/chameleon.png" id="logo" />
          </div>
        </Row>
      ) : (
        <Table bordered size="sm" variant="dark">
          <thead>
            <tr>
              {gameColumns.map((col, i) => (
                <th key={i}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gameRows.map((game, i) => {
              return (
                <tr key={i}>
                  {gameColumns.map((_, j) => (
                    <td key={j}>{`${letters[Math.floor(Math.random() * 3)]}${Math.floor(Math.random() * 4 + 1)}`}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* <!-- game div --> */}
      <div id="game-div">
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
        <Row>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
        </Row>
      </div>
    </Container>
  );
};

export default Game;
