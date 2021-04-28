import React from 'react';
import PageLayout from '../../modules/PageLayout';
import Game from '../../modules/Game';

const RoomId = (props) => {
  return (
    <PageLayout>
      <Game {...props} />
    </PageLayout>
  );
};

export default RoomId;
