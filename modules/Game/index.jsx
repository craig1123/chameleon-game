import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import useSocket from '../../hooks/useSocket';
// import './game.scss';

const Game = () => {
  const router = useRouter();

  useEffect(() => {
    // TODO: redirect if room doesn't exist
    if (router.isReady && !router.query.roomId) {
      router.redirect('/');
    }
  }, [router]);
  // const [metaState, setMetaState] = useState(() => ({}));
  // const { username, usersOnline, rooms } = metaState;

  // const socket = useSocket('acceptuser', (userState) => {
  //   setMetaState((prev) => ({ ...prev, ...userState }));
  // });

  return (
    <Container>
      <Row id="title-div">
        <div className="col-12">
          <h1 id="title">Chameleon</h1>
          <img src="/chameleon.png" id="logo" />
        </div>
      </Row>

      {/* <!-- game div --> */}
      <div id="game-div">
        <hr />
        <Row>
          <div className="col-12" id="room-indicator"></div>
          <div className="col-12" id="user-indicator"></div>
          <div className="col-12">
            <button id="leave" className="box">
              Leave room
            </button>
          </div>
        </Row>
        <hr />
        <Row className="controls">
          <div className="col-6">
            <button id="change-grid" className="box">
              Reset grid
            </button>
          </div>
          <div className="col-6">
            <button id="assign-roles" className="box">
              Assign roles
            </button>
          </div>
        </Row>
        <hr />
        <Row>
          <div className="col-6" id="roleholder">
            <strong id="role">Role unassigned</strong>
          </div>
          <div className="col-6">
            <button id="hide-role" className="box">
              Toggle
            </button>
          </div>
        </Row>
        <hr />
        <Row>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
          <div className="col-6">
            <div className="box grid-item"></div>
          </div>
        </Row>
      </div>
    </Container>
  );
};

export default Game;
