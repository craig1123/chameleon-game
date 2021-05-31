import React from 'react';

import styles from './game.module.scss';

const Check = ({ label, checked }) => (
  <div>
    {label}: &nbsp; {checked ? 'YES' : 'no'}
  </div>
);

const GameRules = ({ roomState }) => {
  const { pointsForGuessing, chameleonSeeClues, privateRoom, anonymousVoting, clueTimer } = roomState;
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
      <div>
        <Check label="1 minute timer" checked={clueTimer} />
      </div>
    </section>
  );
};

export default GameRules;
