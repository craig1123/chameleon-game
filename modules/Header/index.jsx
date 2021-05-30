import React, { Children, Fragment } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
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
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip-player-names">{playersOnline.join(', ')}</Tooltip>}
                >
                  <span className={styles['connection-label']}>Players online: {playersOnline.length}</span>
                </OverlayTrigger>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
