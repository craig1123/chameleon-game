import React from 'react';
import PageLayout from '../modules/PageLayout';
import Login from '../modules/Login';

const Home = (props) => {
  return (
    <PageLayout showChamelon>
      <Login {...props} />
    </PageLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { playerName } = ctx.req.cookies;
  if (playerName) {
    return {
      redirect: {
        destination: '/lobby',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Home;
