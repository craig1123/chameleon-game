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
import PlayersGrid from './PlayersGrid';
import PlayerOptions from './PlayerOptions';

import styles from './game.module.scss';

const Game = ({ socket, activeGame, room }) => {
  const router = useRouter();
  const { playerState } = usePlayer();
  const { username } = playerState;
  const [roomState, setRoomState] = useState(room);
  const [gameState, setGameState] = useState(activeGame);
  const players = Object.keys(roomState.players);
  const allCluesReady = Object.keys(gameState.players).every((player) => gameState.players[player].clueReady);
  const allVotesCast = Object.keys(gameState.players).every((player) => !!gameState.players[player].vote);
  const isChameleon = username === gameState.chameleon;
  const isHost = username === roomState.host;

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

  return (
    <>
      <Header showConnection={false}>
        <GameId roomId={roomState.id} />
        {!roomState.inProgress && (
          <button type="button" onClick={leaveRoom} className={styles['leave-room']}>
            &#8592; Leave Room
          </button>
        )}
      </Header>
      <Toasts socket={socket} callback={kickPlayer} />
      <div className={styles.relative}>
        <Container>
          <Row>
            <Col>
              <PlayersGrid
                gameState={gameState}
                players={players}
                roomState={roomState}
                allCluesReady={allCluesReady}
              />
            </Col>
            <GridOfWords gameState={gameState} isChameleon={isChameleon} />
          </Row>
          <Row>
            <Col>
              <PlayerOptions
                socket={socket}
                roomState={roomState}
                gameState={gameState}
                players={players}
                allCluesReady={allCluesReady}
              />
            </Col>
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
