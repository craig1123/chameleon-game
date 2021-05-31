import React, { useEffect, useRef, useState } from 'react';

import styles from './game.module.scss';

const CountdownGrid = ({ timeUp, timer = 30 }) => {
  const [count, setCount] = useState(timer);
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
      timeUp();
      clearInterval(intervalRef.current);
      return;
    }
  }, [count]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    setCount(timer);
    intervalRef.current = setInterval(decreaseNum, 1000);
  }, [timer]);

  return <span className={styles.countdown}>{count}</span>;
};

export default CountdownGrid;
