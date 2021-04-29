import React from 'react';
import PageLayout from '../modules/PageLayout';
import Login from '../modules/Login';

const Home = (props) => {
  return (
    <PageLayout>
      <Login {...props} />
    </PageLayout>
  );
};

export default Home;
