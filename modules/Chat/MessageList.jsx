import React, { useRef, useEffect } from 'react';
import Message from './Message';

const MessageList = ({ messageList, username }) => {
  const scrollList = useRef(null);

  useEffect(() => {
    scrollList.current.scrollTop = scrollList.current.scrollHeight;
  }, [messageList]);

  return (
    <div className="sc-message-list" ref={scrollList}>
      {messageList.map((chat, i) => (
        <Message chat={chat} username={username} key={`${chat.timeStamp}-${i}`} />
      ))}
    </div>
  );
};

export default MessageList;
