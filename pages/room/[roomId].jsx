import React from 'react';
import fetch from 'isomorphic-unfetch';
import PageLayout from '../../modules/PageLayout';
import Game from '../../modules/Game';
import Chat from '../../modules/Chat';
import config from '../../consts/config';
const { url } = config;

const RoomId = ({ socket, chatRoom, playerName, room, activeGame, roomId }) => {
  return (
    <PageLayout>
      <Game socket={socket} room={room} activeGame={activeGame} />
      <Chat headerName={roomId} socket={socket} playerName={playerName} chatRoom={chatRoom} />
    </PageLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { query, req } = ctx;
  const { playerName } = req.cookies;
  if (!playerName || !query.roomId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { roomId } = query;
  const urls = [`${url}/getRoom/${roomId}`, `${url}/getActiveGrid/${roomId}`, `${url}/getChatRoom/${roomId}`];
  let room = null;
  let activeGame = null;
  let chatRoom = [];
  try {
    const results = await Promise.all(urls.map((url) => fetch(url).then((resp) => resp.json())));
    room = results[0];
    activeGame = results[1];
    chatRoom = results[2];
  } catch (error) {
    console.log(error);
  }

  const player = room?.players?.[playerName] ?? -1;
  const playerExists = player > -1;

  if (!activeGame || !room || !playerExists) {
    return {
      redirect: {
        destination: '/lobby',
        permanent: false,
      },
    };
  }

  return {
    props: {
      room,
      activeGame,
      chatRoom,
      playerName,
      roomId,
    },
  };
};

export default RoomId;
