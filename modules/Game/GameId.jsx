import React from 'react';
import { useCopyClipboard } from 'react-recipes';

const GameId = ({ roomId }) => {
  const [isCopied, setIsCopied] = useCopyClipboard();
  const copy = () => {
    setIsCopied(roomId);
  };
  return (
    <div onClick={copy} style={{ cursor: 'pointer' }} role="button">
      Game id: {roomId} {isCopied && 'Copied!'}
    </div>
  );
};

export default GameId;
