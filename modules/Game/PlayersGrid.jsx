import React from 'react';
import Table from 'react-bootstrap/Table';
import styles from './game.module.scss';

const Players = ({ roomState, gameState, players, allCluesReady }) => {
  const { inProgress } = roomState;
  return (
    <section className={styles.players}>
      <Table responsive size="sm" borderless>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
            <th>Word</th>
            <th>Ready</th>
            <th>Vote</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player}
              className={gameState.chameleon === player && !inProgress ? styles['player-chameleon'] : null}
            >
              <td>{player}</td>
              <td>{roomState.players[player]}</td>
              <td>{allCluesReady ? gameState.players[player].clue : null}</td>
              <td>{gameState.players[player].clueReady && <span>&#10004;</span>}</td>
              <td>{allCluesReady ? gameState.players[player].vote : null}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
};

export default Players;
