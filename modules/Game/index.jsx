import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useSocket from '../../hooks/useSocket';
import { usePlayer } from '../../context/player';
import Header from '../Header';
import Toasts from '../Toasts';
import GridOfWords from './GridOfWords';
import HostOptions from './HostOptions';
import GameId from './GameId';
import Players from './Players';

import styles from './game.module.scss';

const Game = ({ socket, activeGame, room }) => {
  const router = useRouter();
  const { playerState } = usePlayer();
  const { username } = playerState;
  const [roomState, setRoomState] = useState(room);
  const [gameState, setGameState] = useState(activeGame);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.emit('leaveRoom');
      }
    };
  }, []);

  useSocket(socket, 'updateRoom', (state) => {
    if (state.roomState) {
      setRoomState(state.roomState);
    }
    if (state.gameState) {
      setGameState(state.gameState);
    }
  });

  const leaveRoom = () => {
    router.push('/lobby');
  };

  const kickPlayer = (playerName) => {
    if (username === playerName) {
      leaveRoom();
    }
  };

  const players = Object.keys(roomState.players);
  const isChameleon = username === gameState.chameleon;
  const isHost = username === roomState.host;

  return (
    <>
      <Header showConnection={false}>
        <GameId roomId={roomState.id} />
        <button type="button" onClick={leaveRoom} className={styles['leave-room']}>
          &#8592; Leave Room
        </button>
      </Header>
      <Toasts socket={socket} callback={kickPlayer} />
      <div className={styles.relative}>
        <Container>
          <Row>
            <Col>
              <Players socket={socket} gameState={gameState} players={players} roomState={roomState} />
            </Col>
            <GridOfWords gameState={gameState} isChameleon={isChameleon} />
          </Row>
          <Row>
            <Col>
              {isHost && <HostOptions socket={socket} roomState={roomState} gameState={gameState} players={players} />}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Game;
