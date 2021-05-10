import React from 'react';
import Table from 'react-bootstrap/Table';
import styles from './game.module.scss';

function getVote({ allCluesReady, playerObj, anonymousVoting, inProgress }) {
  if (anonymousVoting && allCluesReady && inProgress) {
    return !!playerObj.vote ? '\u2714' : '';
  }

  if (allCluesReady) {
    return playerObj.vote;
  }

  return null;
}

const Players = ({ roomState, gameState, players, allCluesReady, isChameleon }) => {
  const { inProgress, chameleonSeeClues, anonymousVoting } = roomState;
  const { playerShowsClue } = gameState;

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
          {players.map((player) => {
            const playerObj = gameState.players[player];
            return (
              <tr
                key={player}
                className={gameState.chameleon === player && !inProgress ? styles['player-chameleon'] : null}
              >
                <td>{player}</td>
                <td>{roomState.players[player]}</td>
                <td>
                  {allCluesReady || (isChameleon && chameleonSeeClues && playerShowsClue === player)
                    ? playerObj.clue
                    : null}
                </td>
                <td>{playerObj?.clueReady && <span>&#10004;</span>}</td>
                <td>{getVote({ allCluesReady, playerObj, anonymousVoting, inProgress })}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </section>
  );
};

export default Players;
