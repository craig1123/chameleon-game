import App from "next/app";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const App = ({ pageProps, Component }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return <Component {...pageProps} socket={socket} />;
};

export default MyApp;
