import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import useSocket from '../../hooks/useSocket';
import { usePlayer } from '../../context/player';
import Header from '../Header';
import Toasts from '../Toasts';
import GridOfWords from './GridOfWords';
import HostOptions from './HostOptions';
import GameId from './GameId';

import styles from './game.module.scss';

const Game = ({ socket, activeGame, room }) => {
  const router = useRouter();
  const { playerState } = usePlayer();
  const { username } = playerState;
  const [roomState, setRoomState] = useState(room);
  const [gameState, setGameState] = useState(activeGame);

  useEffect(() => {
    return () => {
      socket.emit('leaveRoom');
    };
  }, []);

  useSocket(socket, 'updateRoom', (state) => {
    if (state.roomState) {
      setRoomState(state.roomState);
    }
    console.log(state);
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
      </Header>
      <Toasts socket={socket} callback={kickPlayer} />
      <div className={styles.relative}>
        <Container>
          <GridOfWords gameState={gameState} isChameleon={isChameleon} />
          {isHost && <HostOptions socket={socket} roomState={roomState} gameState={gameState} players={players} />}

          {/* player options, leave game. */}
        </Container>
      </div>
    </>
  );
};

export default Game;
