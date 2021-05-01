import React, { useMemo, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import useIsMobile from '../../hooks/useIsMobile';
import styles from './game.module.scss';

const toMatrix = (arr, width) =>
  arr.reduce(
    (rows, key, index) => (index % width == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
    []
  );

const gameColumns = ['', 'A', 'B', 'C', 'D'];
const gameColumnsMobile = ['', 'A', 'B'];

const GridOfWords = ({ gameState, isChameleon }) => {
  const { grid, gridTitle, keyWord } = gameState;
  const isMobile = useIsMobile();
  const [showTable, setShowTable] = useState(true);
  const fourByFour = useMemo(() => toMatrix(grid, isMobile ? 2 : 4), [grid, isMobile]);
  const tableHeaders = isMobile ? gameColumnsMobile : gameColumns;
  return (
    <section className={styles['grid-of-words']}>
      <div className={styles['table-title']}>
        <button
          onClick={() => setShowTable(!showTable)}
          aria-controls="clue-table"
          aria-expanded={showTable}
          title={showTable ? 'Collapse table' : 'Show table'}
          className={`${styles['arrow-collapse']} ${showTable ? styles['upsideDown'] : ''}`}
        >
          &#x25BC;
        </button>
        <h2>{gridTitle}</h2>
        <h5>{isChameleon ? 'You are the Chameleon!' : `Keyword: ${keyWord}`}</h5>
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
                  <td className={styles['table-vertical']}>{i + 1}</td>
                  {matrix.map((word) => (
                    <td key={word} className={keyWord === word && !isChameleon ? styles['key-word'] : ''}>
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

export default GridOfWords;
