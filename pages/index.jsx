import React from 'react';
import PageLayout from '../modules/PageLayout';
import Lobby from '../modules/Lobby';

const Home = (props) => {
  return (
    <PageLayout>
      <Lobby {...props} />
    </PageLayout>
  );
};

export default Home;
