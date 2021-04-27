import React, { useState } from 'react';
// import Link from "next/link";
import 'game.css';

const Login = () => {
  const [name, setName] = useState('');

  return (
    <div id="login-div">
      <hr />
      <form id="join">
        <div class="form-group">
          <label for="login-name">Name</label>
          <input type="text" required placeholder="Enter a player name" id="login-name" class="form-control" />
          <small id="user-warn" class="form-text text-error"></small>
        </div>
        <div class="form-group">
          <label for="login-room">Room</label>
          <input class="form-control" type="text" required placeholder="Enter a room key" id="login-room" />
        </div>
        <button type="submit" class="btn btn-primary">
          Join
        </button>
      </form>
    </div>
  );
};

export default Login;
