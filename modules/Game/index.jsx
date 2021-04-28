import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import useSocket from '../../hooks/useSocket';
// import './game.scss';

const Game = () => {
  const router = useRouter();
  console.log(router);
  // const [metaState, setMetaState] = useState(() => ({}));
  // const { username, usersOnline, rooms } = metaState;

  // const socket = useSocket('acceptuser', (userState) => {
  //   setMetaState((prev) => ({ ...prev, ...userState }));
  // });

  return (
    <Container>
      <Row id="title-div">
        <div class="col-12">
          <h1 id="title">Chameleon</h1>
          <img src="/chameleon.png" id="logo" />
        </div>
      </Row>

      {/* <!-- game div --> */}
      <div id="game-div">
        <hr />
        <Row>
          <div class="col-12" id="room-indicator"></div>
          <div class="col-12" id="user-indicator"></div>
          <div class="col-12">
            <button id="leave" class="box">
              Leave room
            </button>
          </div>
        </Row>
        <hr />
        <Row class="controls">
          <div class="col-6">
            <button id="change-grid" class="box">
              Reset grid
            </button>
          </div>
          <div class="col-6">
            <button id="assign-roles" class="box">
              Assign roles
            </button>
          </div>
        </Row>
        <hr />
        <Row>
          <div class="col-6" id="roleholder">
            <strong id="role">Role unassigned</strong>
          </div>
          <div class="col-6">
            <button id="hide-role" class="box">
              Toggle
            </button>
          </div>
        </Row>
        <hr />
        <Row>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
          <div class="col-6">
            <div class="box grid-item"></div>
          </div>
        </Row>
      </div>
    </Container>
  );
};

export default Game;
