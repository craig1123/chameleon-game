import React, { useState } from 'react';
import useSocket from '../../hooks/useSocket';
import Launcher from './Launcher';

const Chat = ({ socket, chatRoom, playerName, headerName }) => {
  const [state, setState] = useState(() => ({
    messageList: chatRoom,
    isOpen: false,
    newMessagesCount: 0,
  }));
  const { messageList, isOpen, newMessagesCount } = state;

  useSocket(socket, 'updateChat', (newChat) => {
    setState((prev) => ({
      isOpen: prev.isOpen,
      newMessagesCount: prev.isOpen ? 0 : prev.newMessagesCount + 1,
      messageList: newChat,
    }));
  });

  useSocket(socket, 'updateLobbyChat', (newChat) => {
    if (headerName === 'Lobby') {
      setState((prev) => ({
        isOpen: prev.isOpen,
        newMessagesCount: prev.isOpen ? 0 : prev.newMessagesCount + 1,
        messageList: newChat,
      }));
    }
  });

  const onMessageWasSent = ({ type, message }) => {
    socket.emit('chatMessage', { type, message, headerName });
  };

  const handleOpen = () => {
    setState({
      messageList,
      isOpen: !isOpen,
      newMessagesCount: 0,
    });
  };

  return (
    <Launcher
      showEmoji
      onMessageWasSent={onMessageWasSent}
      messageList={messageList}
      newMessagesCount={newMessagesCount}
      handleClick={handleOpen}
      isOpen={isOpen}
      username={playerName}
      headerName={headerName}
    />
  );
};

export default Chat;
