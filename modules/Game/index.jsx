import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import useSocket from '../../hooks/useSocket';
import 'game.css';

const Game = () => {
  const [name, setName] = useState('');
  // const [field, setField] = useState("");
  // const [newMessage, setNewMessage] = useState(0);
  // const [messages, setMessages] = useState(props.messages || []);

  const socket = useSocket('acceptuser', (message) => {
    const username = message[0];
    localStorage.setItem('userName', username);
  });

  // useSocket("message.chat2", () => {
  //   setNewMessage((newMessage) => newMessage + 1);
  // });

  const handleSubmit = (name) => {
    // create message object
    const message = {
      id: new Date().getTime(),
      value: field,
    };

    // send object to WS server
    socket.emit('message.chat1', message);
    setField('');
    setMessages((messages) => [...messages, message]);
  };

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

// Game.getInitialProps = async () => {
//   const response = await fetch("http://localhost:3000/messages/chat1");
//   const messages = await response.json();

//   return { messages };
// };

export default Game;
