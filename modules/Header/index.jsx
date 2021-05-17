import React, { Children, Fragment } from 'react';
import { usePlayer } from '../../context/player';

import styles from './header.module.scss';

const Header = ({ children, showPlayersOnline = false, showConnection = false }) => {
  const { playerState } = usePlayer();
  const { playersOnline, connected } = playerState;

  return (
    <>
      <header className={styles.header}>
        <div className={styles['header-col']}>
          <div className={styles['header-connection']}>
            {children &&
              Children.map(children, (child, i) => (
                <Fragment key={i}>
                  {child}
                  <span className={styles['header-separator']}></span>
                </Fragment>
              ))}
            {showConnection && (
              <>
                <span className={styles['connection-label']}>Connection: </span>
                <span className={styles.circle} style={{ background: connected ? '#67c23a' : '#f56c6c' }} />
              </>
            )}
            {showPlayersOnline && (
              <>
                <span className={styles['header-separator']}></span>
                <span className={styles['connection-label']}>Players online: {playersOnline}</span>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
