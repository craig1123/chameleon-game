import React from 'react';
import fetch from 'isomorphic-unfetch';
import PageLayout from '../modules/PageLayout';
import Lobby from '../modules/Lobby';
import Chat from '../modules/Chat';
import config from '../consts/config';
const { url } = config;

const LobbyPage = ({ socket, roomsObj, playerName, chatRoom }) => {
  return (
    <PageLayout showChamelon>
      <Lobby socket={socket} roomsObj={roomsObj} playerName={playerName} />
      <Chat headerName="Lobby" socket={socket} playerName={playerName} chatRoom={chatRoom} />
    </PageLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { playerName } = ctx.req.cookies;
  if (!playerName) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const urls = [`${url}/rooms/`, `${url}/getChatRoom/Lobby`];
  let roomsObj = {};
  let chatRoom = [];
  try {
    const results = await Promise.all(urls.map((url) => fetch(url).then((resp) => resp.json())));
    roomsObj = results[0];
    chatRoom = results[1] || [];
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      roomsObj,
      playerName,
      chatRoom,
    },
  };
};

export default LobbyPage;
