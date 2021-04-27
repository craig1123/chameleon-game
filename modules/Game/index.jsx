import React, { useState } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import useSocket from "../hooks/useSocket";
import "game.css";

const Game = (props) => {
  // const [field, setField] = useState("");
  // const [newMessage, setNewMessage] = useState(0);
  // const [messages, setMessages] = useState(props.messages || []);

  // const socket = useSocket("message.chat1", (message) => {
  //   setMessages((messages) => [...messages, message]);
  // });

  // useSocket("message.chat2", () => {
  //   setNewMessage((newMessage) => newMessage + 1);
  // });

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   // create message object
  //   const message = {
  //     id: new Date().getTime(),
  //     value: field,
  //   };

  //   // send object to WS server
  //   socket.emit("message.chat1", message);
  //   setField("");
  //   setMessages((messages) => [...messages, message]);
  // };

  return (
    <>
      <div class="container">
        <div id="title-div" class="row">
          <div class="col-12">
            <h1 id="title">Chameleon</h1>
            <img src="/chameleon.png" id="logo" />
          </div>
        </div>

        {/* <!-- game div --> */}
        <div id="game-div">
          <hr />
          <div class="row">
            <div class="col-12" id="room-indicator"></div>
            <div class="col-12" id="user-indicator"></div>
            <div class="col-12">
              <button id="leave" class="box">
                Leave room
              </button>
            </div>
          </div>
          <hr />
          <div class="row controls">
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
          </div>
          <hr />
          <div class="row">
            <div class="col-6" id="roleholder">
              <strong id="role">Role unassigned</strong>
            </div>
            <div class="col-6">
              <button id="hide-role" class="box">
                Toggle
              </button>
            </div>
          </div>
          <hr />
          <div class="row">
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
          </div>
        </div>
      </div>
    </>
  );
};

// Game.getInitialProps = async () => {
//   const response = await fetch("http://localhost:3000/messages/chat1");
//   const messages = await response.json();

//   return { messages };
// };

export default Game;
