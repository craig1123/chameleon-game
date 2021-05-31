import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './ChatWindow';

const Launcher = ({
  onMessageWasSent,
  newMessagesCount = 0,
  isOpen,
  handleClick,
  messageList,
  mute,
  showEmoji = true,
  username,
  headerName,
}) => {
  const [open, setOpen] = useState(false);
  const firstUpdate = useRef(true);
  const audio = useRef(null);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (mute) {
      return;
    }
    const nextMessage = messageList[messageList.length - 1] || {};
    const isIncoming = nextMessage.username !== username && nextMessage.prevUser !== username;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIncoming && audio.current && !isSafari) {
      audio.current.play();
    }
  }, [messageList, mute, username]);

  const onClick = () => {
    if (handleClick) {
      handleClick();
    } else {
      setOpen((prev) => !prev.open);
    }
  };

  const classList = ['sc-launcher', open ? 'opened' : ''];
  return (
    <div id="sc-launcher">
      <div className={classList.join(' ')} onClick={onClick}>
        <MessageCount count={newMessagesCount} open={open} />
        <img className="sc-open-icon" src="/chat/close-icon.png" />
        <img className="sc-closed-icon" src="/chat/logo-no-bg.svg" />
        <audio ref={audio}>
          <source src="./chat/notification.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <ChatWindow
        messageList={messageList}
        onMessageWasSent={onMessageWasSent}
        isOpen={open}
        onClose={onClick}
        showEmoji={showEmoji}
        headerName={headerName}
        username={username}
      />
    </div>
  );
};

const MessageCount = (props) => {
  if (props.count === 0 || props.open === true) {
    return null;
  }
  return <div className={'sc-new-messages-count'}>{props.count}</div>;
};

export default Launcher;
