import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookies from 'js-cookie';
import useSocket from '../../hooks/useSocket';
import { usePlayer } from '../../context/player';
import Header from '../Header';
import Toasts from '../Toasts';
import GridOfWords from './GridOfWords';
import HostOptions from './HostOptions';
import GameId from './GameId';
import PlayersGrid from './PlayersGrid';
import GameRules from './GameRules';

import styles from './game.module.scss';

const PlayerOptions = dynamic(() => import('./PlayerOptions'), { ssr: false });

const leaveMessage = 'The game is in progress. Are you sure you want to leave?';

const throwConfetti = async () => {
  const party = await import('party-js');
  let times = 0;
  const interval = setInterval(() => {
    party.confetti(document.body, {
      count: 100,
    });
    times++;
    if (times === 2) {
      clearInterval(interval);
    }
  }, 2000);
};

const Game = ({ socket, activeGame, room }) => {
  const router = useRouter();
  const { playerState } = usePlayer();
  const { username } = playerState;
  const [state, setState] = useState(() => ({ roomState: room, gameState: activeGame }));
  const { roomState, gameState } = state;
  const players = Object.keys(roomState.players);
  const allCluesReady = Object.keys(gameState.players).every((player) => gameState.players[player]?.clueReady);
  const isChameleon = username === gameState.chameleon;
  const isHost = username === roomState.host;
  const { inProgress } = roomState;

  useEffect(() => {
    // if user doesn't exist in game, add them on mount
    const playerName = Cookies.get('playerName') || '';
    if (socket && playerName && !room[playerName]) {
      socket.emit('requestRoom', { requestedRoom: room.id });
    }

    const onVisibilitychange = () => {
      if (!document.hidden) {
        // check if user still exists in game
        const player = room?.players?.[playerName] ?? -1;
        const playerExists = player > -1;

        if (!playerExists) {
          router.push('/lobby');
        }
      }
    };

    window.addEventListener('visibilitychange', onVisibilitychange);
    return () => {
      if (socket) {
        socket.emit('leaveRoom');
        Cookies.remove('roomId');
      }
      window.removeEventListener('visibilitychange', onVisibilitychange);
    };
  }, []);

  useEffect(() => {
    const onUnload = (e) => {
      e.preventDefault();

      (e || window.event).returnValue = leaveMessage; // Gecko + IE
      return leaveMessage;
    };
    if (inProgress) {
      addEventListener('beforeunload', onUnload, { capture: true });
    } else {
      removeEventListener('beforeunload', onUnload, { capture: true });
    }
    return () => {
      removeEventListener('beforeunload', onUnload, { capture: true });
    };
  }, [inProgress]);

  useSocket(socket, 'updateRoom', (state) => {
    setState((prev) => ({
      roomState: state.roomState || prev.roomState,
      gameState: state.gameState || prev.gameState,
    }));
  });

  const leaveRoom = () => {
    Cookies.remove('roomId');
    router.push('/lobby');
  };

  const promptLeave = () => {
    if (!inProgress) {
      leaveRoom();
    } else if (window.confirm(leaveMessage)) {
      leaveRoom();
    }
  };

  const kickPlayer = (playerName) => {
    if (username === playerName) {
      leaveRoom();
    }
  };

  const handleToasts = (args) => {
    switch (args.key) {
      case 'wrongWord': {
        if (username !== gameState.chameleon) {
          throwConfetti();
        }
        break;
      }
      case 'correctWord':
      case 'chameleonEscaped': {
        if (username === gameState.chameleon) {
          throwConfetti();
        }
        break;
      }
      case 'kickPlayer': {
        kickPlayer(args.playerName);
        break;
      }
      case 'roomClosed': {
        leaveRoom();
        break;
      }

      default:
        break;
    }
  };

  return (
    <>
      <Header showConnection>
        <button type="button" onClick={promptLeave} className={styles['leave-room']}>
          &#8592; Leave Room
        </button>
        <GameId roomId={roomState.id} />
      </Header>
      <Toasts socket={socket} callback={handleToasts} />
      <div className={styles.relative}>
        <Container>
          <Row>
            <Col>
              <PlayersGrid
                gameState={gameState}
                players={players}
                roomState={roomState}
                allCluesReady={allCluesReady}
                isChameleon={isChameleon}
              />
            </Col>
            <GridOfWords socket={socket} gameState={gameState} inProgress={inProgress} isChameleon={isChameleon} />
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
              {!isHost && <GameRules roomState={roomState} />}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Game;
