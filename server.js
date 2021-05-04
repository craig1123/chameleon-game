const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const wordSheet = require('./consts/wordSheet.js');
const fakeRooms = require('./consts/fakeRooms.js');
const fakeActiveGrids = require('./consts/fakeActiveGrids');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
// for scaling if we need more CPU cores https://github.com/mars/heroku-nextjs-custom-server-express/blob/master/server.js

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// fake DB - probably don't need a db
// ======
// globals
// ======
const MAX_PLAYERS = 10;
// an array of all users
const users = [];
// active rooms
const rooms = dev ? fakeRooms : {};
// roomId: {
//   id: string,
//   host: username,
//   players: {
//     [userName]: points (number)
//   },
//   inProgress: boolean
//   full: boolean
//   privateRoom?: boolean
//   chameleonSeeClues?: boolean
//   pointsForGuessing?: boolean
//   chat: [] // TODO in the future
// }

// grid by room
const active_grids = dev ? fakeActiveGrids : {};
// roomId: {
//   grid: string[],
//   gridTitle: string,
//   keyWord: string,
//   chameleon: username,
//   boardIsClickable: boolean
//   playerShowsClue: username
//   players: {
//     [username]: {
//       clue: string,
//       clueReady: boolean,
//       vote: string,
//     },
//   },
// };

// array of grid titles
const gridTitles = Object.keys(wordSheet) || [];
const gridTitlesLength = gridTitles.length;
// =========
// functions
// =========

// random integer choice from 0:N-1
function getRandomChoice(N) {
  return Math.floor(Math.random() * N);
}
function getRandomValue(arr) {
  return arr[getRandomChoice(arr.length)];
}

// remove a user from an array
function removeUserFromArr(username, array) {
  const index = array.indexOf(username);
  // if we found a use remove them
  if (index > -1) {
    array.splice(index, 1);
  }
}

// removes users from objects
function removeUserFromRoom(username, roomId) {
  if (rooms[roomId]) {
    delete rooms[roomId].players[username];
    const players = Object.keys(rooms[roomId].players);
    if (rooms[roomId].host === username && players.length > 0) {
      // assign new host
      rooms[roomId].host = getRandomValue(players);
    }
  }
  if (active_grids[roomId]) {
    delete active_grids[roomId].players[username];
  }
}

// is a username available?
function userNameExists(username) {
  return users.indexOf(username) > -1;
}

// get a random grid
function randomGrid() {
  const gridTitle = gridTitles[getRandomChoice(gridTitlesLength)];
  return {
    gridTitle: gridTitle,
    grid: wordSheet[gridTitle],
  };
}

// did the chameleon escape
function didChameleonEscape(currentGrid) {
  // if all votes are cast count up the points
  let chameleonEscapes = false;
  // count up votes
  const votes = {};
  const players = Object.keys(currentGrid.players);
  players.forEach((player) => {
    const vote = currentGrid.players[player].vote;
    if (votes[vote]) {
      votes[vote]++;
    } else {
      votes[vote] = 1;
    }
  });
  // find the highest vote
  let highestNum = 0;
  const highestVote = Object.keys(votes).reduce((a, b) => {
    if (votes[a] === votes[b]) {
      highestNum = 'tie';
      return a;
    }
    if (votes[a] > votes[b]) {
      highestNum = votes[a];
      return a;
    }
    return b;
  }, highestNum);

  if (highestVote !== currentGrid.chameleon || highestNum === 'tie') {
    chameleonEscapes = true;
  }

  return chameleonEscapes;
}

// ======================
// socket.io
// ======================

io.on('connection', function (socket) {
  // TODO: send all players
  socket.emit('connected', { playersOnline: users.length, connected: true });

  // locals
  let username;
  let roomId;

  // exit room
  function exitRoom() {
    socket.to(roomId).emit('updateRoom', { roomState: rooms[roomId] });
    socket.leave(roomId);

    if (rooms[roomId] && Object.keys(rooms[roomId].players).length === 0) {
      delete rooms[roomId];
      delete active_grids[roomId];
    }

    roomId = undefined;
  }

  function removePlayer() {
    if (username !== undefined) {
      removeUserFromArr(username, users);
      username = undefined;
    }
    if (username !== undefined && roomId !== undefined) {
      removeUserFromRoom(username, roomId);
      exitRoom();
    }
  }

  // disconnect
  socket.on('removePlayer', removePlayer);
  socket.on('disconnect', removePlayer);

  // leaveroom event
  socket.on('leaveRoom', function () {
    removeUserFromRoom(username, roomId);
    exitRoom();
  });

  socket.on('requestuser', function (requestedUsername) {
    console.log('A user requested sign up: ' + requestedUsername);

    if (userNameExists(requestedUsername)) {
      socket.emit('signUpError', 'The name you selected is already taken');
      return;
    }

    username = requestedUsername;
    users.push(username);
    socket.emit('acceptuser', { username, playersOnline: users.length, rooms });
  });

  socket.on('requestRoom', function (preferences) {
    const { requestedRoom } = preferences;

    if (rooms[requestedRoom] === undefined) {
      console.log(username + ' is requesting a new room: ' + requestedRoom);
      const { gameTitle, privateRoom, chameleonSeeClues, pointsForGuessing } = preferences;
      const newGrid = gameTitle ? { gridTitle: gameTitle, grid: wordSheet[gameTitle] } : randomGrid();
      rooms[requestedRoom] = {
        id: requestedRoom,
        host: username,
        players: {
          [username]: 0,
        },
        privateRoom,
        chameleonSeeClues,
        pointsForGuessing,
      };
      active_grids[requestedRoom] = {
        grid: newGrid.grid,
        gridTitle: newGrid.gridTitle,
        keyWord: '',
        chameleon: '',
        playerShowsClue: '',
        boardIsClickable: false,
        players: {
          [username]: {
            clue: '',
            clueReady: false,
            vote: '',
          },
        },
      };
      roomId = requestedRoom;
      socket.join(roomId);
      io.in(roomId).emit('updateRoom', { roomState: rooms[roomId], gameState: active_grids[roomId] });
      socket.emit('acceptJoinGame', requestedRoom);
    } else if (rooms[requestedRoom] && Object.keys(rooms[requestedRoom].players).length >= MAX_PLAYERS) {
      socket.emit('toaster', { title: 'Error', message: 'The room you requested is full' }, rooms);
      return;
    } else if (rooms[requestedRoom] && active_grids[requestedRoom]) {
      roomId = requestedRoom;
      rooms[roomId].players[username] = 0;
      active_grids[roomId].players[username] = {
        clue: '',
        clueReady: false,
        vote: '',
      };
      if (Object.keys(rooms[requestedRoom].players).length === MAX_PLAYERS) {
        rooms[roomId].full = true;
      }
      socket.join(roomId);
      io.in(roomId).emit('updateRoom', { roomState: rooms[roomId], gameState: active_grids[roomId] });
      socket.emit('acceptJoinGame', requestedRoom);
    }
  });

  // host starts the game
  socket.on('startGame', function () {
    const currentGrid = active_grids[roomId];
    const currentRoom = rooms[roomId];
    if (!currentRoom || !currentGrid) {
      return;
    }
    const players = Object.keys(currentGrid.players);
    const chameleon = getRandomValue(players);
    const restOfPlayers = players.filter((player) => player !== chameleon);
    rooms[roomId].inProgress = true;
    active_grids[roomId].boardIsClickable = false;
    active_grids[roomId].playerShowsClue = currentRoom.chameleonSeeClues ? getRandomValue(restOfPlayers) : '';
    active_grids[roomId].keyWord = getRandomValue(currentGrid.grid);
    active_grids[roomId].chameleon = chameleon;
    active_grids[roomId].players = players.reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: {
          clue: '',
          clueReady: false,
          vote: '',
        },
      }),
      {}
    );
    io.in(roomId).emit('updateRoom', { roomState: rooms[roomId], gameState: active_grids[roomId] });
  });

  // Game ends. Add the points
  // PLAYER OPTIONS
  socket.on('updatePlayerOption', function (options) {
    if (!active_grids[roomId] || !username) {
      return;
    }
    options.forEach(({ optionName, value }) => {
      active_grids[roomId].players[username][optionName] = value;
    });
    io.in(roomId).emit('updateRoom', { gameState: active_grids[roomId] });
  });

  socket.on('updateVote', function (playerVote) {
    const currentGrid = active_grids[roomId];
    if (!currentGrid || !username) {
      return;
    }
    active_grids[roomId].players[username].vote = playerVote;
    const allVotesCast = Object.keys(active_grids[roomId].players).every(
      (player) => !!active_grids[roomId].players[player].vote
    );

    // update vote
    if (!allVotesCast) {
      io.in(roomId).emit('updateRoom', { gameState: active_grids[roomId] });
      return;
    }

    const chameleonEscapes = didChameleonEscape(active_grids[roomId]);

    // if he doesn't escape, the chameleon has a chance at 1 point
    if (!chameleonEscapes) {
      io.in(roomId).emit(
        'toaster',
        {
          title: 'Congrats!',
          message: `The chameleon was found! ${currentGrid.chameleon} now gets a chance to pick the correct clue.`,
        },
        { key: 'chameleonFound' }
      );

      active_grids[roomId].boardIsClickable = true;
      io.in(roomId).emit('updateRoom', { gameState: active_grids[roomId] });
      return;
    }

    // end game and add scores
    rooms[roomId].inProgress = false;

    Object.keys(rooms[roomId].players).forEach((player) => {
      if (currentGrid.chameleon === player) {
        // chameleon gets 2 points
        rooms[roomId].players[player] = rooms[roomId].players[player] + 2;
        return;
      }

      // if you voted for the chameleon, even though he escaped, you get a point
      if (rooms[roomId].pointsForGuessing && active_grids[roomId].players[player].vote === currentGrid.chameleon) {
        rooms[roomId].players[player] = rooms[roomId].players[player] + 1;
      }
    });

    io.in(roomId).emit('updateRoom', { roomState: rooms[roomId], gameState: active_grids[roomId] });
    io.in(roomId).emit(
      'toaster',
      {
        title: 'Oh no!',
        message: `The chameleon has escaped! Congrats to ${currentGrid.chameleon} and better luck next time for everyone else.`,
      },
      { key: 'chameleonEscaped' }
    );
  });

  socket.on('chameleonGuesses', function (word) {
    const currentGrid = active_grids[roomId];
    const currentRoom = rooms[roomId];
    if (!currentGrid || !username) {
      return;
    }
    const { chameleon } = currentGrid;

    if (word === currentGrid.keyWord) {
      io.in(roomId).emit(
        'toaster',
        {
          title: 'Nice!',
          message: `The chameleon guessed the correct word. Congrats to ${chameleon} and better luck next time for everyone else.`,
        },
        { key: 'correctWord' }
      );
      rooms[roomId].players[chameleon] = currentRoom.players[chameleon] + 1;
    } else {
      io.in(roomId).emit(
        'toaster',
        {
          title: 'Wrong',
          message: `The chameleon guessed the wrong word. +1 for everyone else. Host ${currentRoom.host} needs to press "Start Game" to keep playing`,
        },
        { key: 'wrongWord' }
      );
      Object.keys(currentRoom.players).forEach((player) => {
        if (chameleon !== player) {
          // everyone but the chameleon gets a point
          rooms[roomId].players[player] = currentRoom.players[player] + 1;
          return;
        }
      });
    }

    rooms[roomId].inProgress = false;
    io.in(roomId).emit('updateRoom', { roomState: rooms[roomId], gameState: active_grids[roomId] });
  });

  // HOST OPTIONS
  socket.on('kickPlayer', function (playerName) {
    if (!rooms[roomId]) {
      return;
    }
    io.in(roomId).emit(
      'toaster',
      { title: 'Kicked Player', message: `Player ${playerName} was kicked from the room` },
      { key: 'kickPlayer', playerName }
    );
  });

  socket.on('changeGrid', function (gameTitle) {
    if (!active_grids[roomId]) {
      return;
    }
    const newGrid = gameTitle === 'random' ? randomGrid() : { gridTitle: gameTitle, grid: wordSheet[gameTitle] };
    active_grids[roomId].grid = newGrid.grid;
    active_grids[roomId].gridTitle = newGrid.gridTitle;
    active_grids[roomId].keyWord = '';
    active_grids[roomId].chameleon = '';
    io.in(roomId).emit('updateRoom', { gameState: active_grids[roomId] });
  });

  socket.on('changeRoomOptions', function ({ name, value }) {
    if (!rooms[roomId]) {
      return;
    }
    rooms[roomId][name] = value;
    io.in(roomId).emit('updateRoom', { roomState: rooms[roomId] });
  });
});

nextApp.prepare().then(() => {
  app.get('/rooms', (req, res) => {
    res.json(rooms);
  });

  app.get('/getRoom/:roomId', (req, res) => {
    const room = rooms[req.params.roomId];
    if (room) {
      res.json(room);
    } else {
      res.json(null);
    }
  });

  app.get('/getActiveGrid/:roomId', (req, res) => {
    const grid = active_grids[req.params.roomId];
    if (grid) {
      res.json(grid);
    } else {
      res.json(null);
    }
  });

  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
