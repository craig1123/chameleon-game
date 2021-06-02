import React, { useEffect } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import Header from './Header';
import useIsMobile from '../../hooks/useIsMobile';

const ChatWindow = ({ messageList, onMessageWasSent, headerName, isOpen, onClose, showEmoji, username }) => {
  const isMobile = useIsMobile();
  const onSubmit = (message) => {
    onMessageWasSent(message);
  };

  useEffect(() => {
    if (!isMobile) return;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    function resetBody() {
      if (document.body) {
        document.body.style.overflow = '';
        if (isSafari) {
          const offsetY = Math.abs(parseInt(document.body.style.top || '0', 10));
          document.body.style.position = '';
          document.body.style.top = '';
          window.scrollTo(0, offsetY || 0);
        }
      }
    }
    if (isOpen) {
      const scroll = window.scrollY;
      document.body.style.overflow = 'hidden';
      if (isSafari) {
        document.body.style.position = 'fixed';
        document.body.style.top = `${scroll}px`;
      }
    } else {
      resetBody();
    }
  }, [isOpen, isMobile]);

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
