import React from 'react';
import { usePlayer } from '../../context/player';
import GameId from '../Game/GameId';

import styles from './header.module.scss';

const Header = ({ children, showConnection = true }) => {
  const { playerState } = usePlayer();
  const { playersOnline, connected } = playerState;

  return (
    <>
      <div className={styles['header-fill']} />
      <header className={styles.header}>
        <div className={styles['header-col']}>
          <div className={styles['header-connection']}>
            <span className={styles['connection-label']}>Connection: </span>
            <span className={styles.circle} style={{ background: connected ? '#67c23a' : '#f56c6c' }}></span>
            {showConnection && (
              <>
                <span className={styles['header-separator']}></span>
                <span className={styles['connection-label']}>Players online: {playersOnline}</span>
              </>
            )}
            {children && (
              <>
                <span className={styles['header-separator']}></span>
                {children}
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
