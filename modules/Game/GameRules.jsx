import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import styles from './game.module.scss';

const Check = ({ label, checked }) => (
  <div>
    {label}: &nbsp; {checked ? 'YES' : 'no'}
  </div>
);

const GameRules = ({ roomState }) => {
  const { pointsForGuessing, chameleonSeeClues, privateRoom, anonymousVoting } = roomState;
  return (
    <section className={styles['host-options']}>
      <h4 className="marker">Game Options</h4>
      <Check label="Private Game" checked={privateRoom} />
      <div>
        <Check checked={pointsForGuessing} label="1 point for guessing chameleon" />
      </div>
      <div>
        <Check checked={chameleonSeeClues} label="Chameleon can see one random player's clue" />
      </div>
      <div>
        <Check label="Anonymous Voting" checked={anonymousVoting} />
      </div>
    </section>
  );
};

export default GameRules;
