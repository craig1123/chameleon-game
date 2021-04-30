import React from 'react';
import fetch from 'isomorphic-unfetch';
import PageLayout from '../modules/PageLayout';
import Lobby from '../modules/Lobby';
import config from '../consts/config';

const LobbyPage = (props) => {
  return (
    <PageLayout>
      <Lobby {...props} />
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

  let roomsObj = {};
  try {
    const response = await fetch(`${config.url}/rooms`);
    roomsObj = await response.json();
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      roomsObj,
      playerName,
    },
  };
};

export default LobbyPage;
