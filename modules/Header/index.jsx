import React, { Children, Fragment } from 'react';
import { usePlayer } from '../../context/player';

import styles from './header.module.scss';

const Header = ({ children, showConnection = true }) => {
  const { playerState } = usePlayer();
  const { playersOnline, connected } = playerState;

  return (
    <>
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
            {children &&
              Children.map(children, (child, i) => (
                <Fragment key={i}>
                  <span className={styles['header-separator']}></span>
                  {child}
                </Fragment>
              ))}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
