import React from 'react';

import styles from './game.module.scss';

const Check = ({ label, checked }) => (
  <div>
    {label}: &nbsp; {checked ? 'YES' : 'NO'}
  </div>
);

const GameRules = ({ roomState }) => {
  const { pointsForGuessing, chameleonSeeClues, privateRoom, anonymousVoting, clueTimer } = roomState;
  return (
    <section className={styles['host-options']}>
      <h4 className="marker">Game Options</h4>
      <Check checked={pointsForGuessing} label="1 point for guessing chameleon" />
      <Check checked={chameleonSeeClues} label="Chameleon can see one random player's clue" />
      <Check label="Anonymous Voting" checked={anonymousVoting} />
      <Check label="1 minute timer" checked={clueTimer} />
      <Check label="Private Game" checked={privateRoom} />
    </section>
  );
};

export default GameRules;
