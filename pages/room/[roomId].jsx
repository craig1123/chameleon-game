import React from 'react';
import fetch from 'isomorphic-unfetch';
import PageLayout from '../../modules/PageLayout';
import Game from '../../modules/Game';
import config from '../../consts/config';

const RoomId = (props) => {
  return (
    <PageLayout>
      <Game {...props} />
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

  const urls = [`${config.url}/getRoom/${ctx.query.roomId}`, `${config.url}/getActiveGrid/${ctx.query.roomId}`];
  let room = null;
  let activeGame = null;
  try {
    const results = await Promise.all(urls.map((url) => fetch(url).then((resp) => resp.json())));
    room = results[0];
    activeGame = results[1];
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
    },
  };
};

export default RoomId;
