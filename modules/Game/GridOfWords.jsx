import React, { useMemo, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import useIsMobile from '../../hooks/useIsMobile';
import CountdownGrid from './CountdownGrid';

import styles from './game.module.scss';

const toMatrix = (arr = [], width = 4) =>
  arr.reduce(
    (rows, key, index) => (index % width == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
    []
  );

const gameColumns = ['', 'A', 'B', 'C', 'D'];
const gameColumnsMobile = ['A', 'B', 'C', 'D'];

const GridOfWords = ({ socket, gameState, isChameleon, inProgress }) => {
  const { grid, gridTitle, keyWord, boardIsClickable } = gameState;
  const isMobile = useIsMobile();
  const [showTable, setShowTable] = useState(true);
  const fourByFour = useMemo(() => toMatrix(grid, 4), [grid]);
  const tableHeaders = isMobile ? gameColumnsMobile : gameColumns;
  const canClickCells = boardIsClickable && isChameleon && inProgress;

  const handleCellClick = (word) => async () => {
    if (!canClickCells) {
      return;
    }

    if (word === keyWord) {
      const party = await import('party-js');
      const clueTable = document.getElementById('clue-table');
      party.sparkles(clueTable, {
        count: 100,
      });
    }

    socket.emit('chameleonGuesses', word);
  };

  const timeUp = () => {
    socket.emit('chameleonGuesses', 'RAN OUT OF TIME!');
  };

  return (
    <section className={styles['grid-of-words']}>
      <div className={styles['table-title']}>
        {canClickCells && <CountdownGrid timeUp={timeUp} />}
        {isMobile && (
          <button
            onClick={() => setShowTable(!showTable)}
            aria-controls="clue-table"
            aria-expanded={showTable}
            type="button"
            title={showTable ? 'Collapse table' : 'Show table'}
            className={`${styles['arrow-collapse']} ${showTable ? styles['upsideDown'] : ''}`}
          >
            &#x25BC;
          </button>
        )}
        <h2>{gridTitle}</h2>
        <h5>{getGridSubTitle(keyWord, gameState, isChameleon)}</h5>
      </div>
      <Collapse in={showTable}>
        <div>
          <Table variant="light" className={styles['grid-table']} id="clue-table">
            <thead>
              <tr>
                {tableHeaders.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fourByFour.map((matrix, i) => (
                <tr key={i}>
                  {!isMobile && <td className={styles['table-vertical']}>{i + 1}</td>}
                  {matrix.map((word) => (
                    <td
                      onClick={handleCellClick(word)}
                      key={word}
                      className={`${keyWord === word && (!isChameleon || !inProgress) ? styles['key-word'] : ''} ${
                        canClickCells ? styles['glowing-cells'] : ''
                      }`}
                    >
                      {word}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Collapse>
    </section>
  );
};

function getGridSubTitle(keyWord, gameState, isChameleon) {
  if (isChameleon && gameState.boardIsClickable) {
    return 'Guess/Select a word below';
  }
  if (isChameleon) {
    return 'You are the CHAMELEON! Blend in.';
  }

  if (!keyWord || keyWord === '') {
    return '...';
  }

  return `Keyword: ${keyWord}`;
}

export default GridOfWords;
