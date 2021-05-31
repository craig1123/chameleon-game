import React from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import Header from './Header';

const ChatWindow = ({ messageList, onMessageWasSent, headerName, isOpen, onClose, showEmoji, username }) => {
  const onSubmit = (message) => {
    onMessageWasSent(message);
  };

  const classList = ['sc-chat-window', isOpen ? 'opened' : 'closed'];
  return (
    <div className={classList.join(' ')}>
      <Header headerName={headerName} onClose={onClose} />
      <MessageList messageList={messageList} username={username} />
      <UserInput onSubmit={onSubmit} showEmoji={showEmoji} username={username} />
    </div>
  );
};

export default ChatWindow;
