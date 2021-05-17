import React, { useEffect, useRef, useState } from 'react';

import styles from './game.module.scss';

const CountdownGrid = ({ socket }) => {
  const [count, setCount] = useState(30);
  let intervalRef = useRef();

  const decreaseNum = () => {
    setCount((prev) => prev - 1);
  };

  useEffect(() => {
    intervalRef.current = setInterval(decreaseNum, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (count === 0) {
      socket.emit('chameleonGuesses', 'RAN OUT OF TIME!');
      clearInterval(intervalRef.current);
      return;
    }
  }, [count]);

  return <span className={styles.countdown}>{count}</span>;
};

export default CountdownGrid;
