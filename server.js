const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  transports: ['websocket'],
});
const next = require('next');
const cookie = require('cookie');
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
const RECONNECTION_TIME = dev ? 5000 : 60000; // in ms
// an array of all users
const users = [];
const usersConnected = [];
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
//   anonymousVoting: boolean
//   clueTimer: boolean
//   chat: [] // TODO in the future, maybe put in it's own object like active_grids
// }

// grid by room
const active_grids = dev ? fakeActiveGrids : {};
// roomId: {
//   grid: string[],
//   gridTitle: string,
//   keyWord: string,
//   chameleon: username,
//   gridSelect: string | 'random'
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

// ======================
// socket.io
// ======================
io.on('connection', function (socket) {
  const cookies = socket.handshake.headers.cookie ? cookie.parse(socket.handshake.headers.cookie) : {};
  // locals
  let username = cookies.playerName || undefined;
  let roomId = cookies.roomId || undefined;
  if (username && !userNameExists(username)) {
    users.push(username);
  }
  if (username && usersConnected.indexOf(username) === -1) {
    usersConnected.push(username);
  }
  if (roomId && active_grids[roomId]) {
    socket.join(roomId);
  }

  socket.emit('connected', { playersOnline: users, connected: true, username });

  // exit room
  function exitRoom() {
    socket.to(roomId).emit('updateRoom', { roomState: rooms[roomId] });
    socket.leave(roomId);

    if (rooms[roomId] && Object.keys(rooms[roomId].players).length < 1) {
      delete rooms[roomId];
      delete active_grids[roomId];
      io.emit('moreRooms', rooms);
    }

    roomId = undefined;
  }

  function removePlayer() {
    if (roomId !== undefined) {
      removeUserFromRoom(username, roomId);
    }
    if (username !== undefined) {
      removeUserFromArr(username, users);
      username = undefined;
    }
    if (roomId !== undefined) {
      exitRoom();
    }
  }

  // disconnect
  socket.on('removePlayer', removePlayer);
  socket.on('disconnect', function () {
    // remove from usersConnected array immediately
    removeUserFromArr(username, usersConnected);
    // give a timeout
    setTimeout(() => {
      // if they didn't reconnect in that time... axe 'em
      if (usersConnected.indexOf(username) < 0) {
        removePlayer();
      }
    }, RECONNECTION_TIME);
  });

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
    socket.emit('acceptuser', { username, playersOnline: users, rooms });
  });

  socket.on('requestRoom', function (preferences) {
    const { requestedRoom } = preferences;
    // host new room
    if (rooms[requestedRoom] === undefined) {
      console.log(username + ' is requesting a new room: ' + requestedRoom);
      const { gridSelect, privateRoom, chameleonSeeClues, pointsForGuessing, anonymousVoting, clueTimer } = preferences;
      const newGrid = gridSelect === 'random' ? randomGrid() : { gridTitle: gridSelect, grid: wordSheet[gridSelect] };
      rooms[requestedRoom] = {
        id: requestedRoom,
        host: username,
        players: {
          [username]: 0,
        },
        privateRoom,
        chameleonSeeClues,
        pointsForGuessing,
        anonymousVoting,
        clueTimer,
      };
      active_grids[requestedRoom] = {
        gridSelect,
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
      io.emit('moreRooms', rooms);
    } else if (rooms[requestedRoom] && Object.keys(rooms[requestedRoom].players).length >= MAX_PLAYERS) {
      // rooms are full
      socket.emit('toaster', { title: 'Error', message: 'The room you requested is full', type: 'error' }, rooms);
      return;
    } else if (rooms[requestedRoom] && active_grids[requestedRoom]) {
      // join a rom
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
    const newGrid =
      currentGrid.gridSelect === 'random' ? randomGrid() : { gridTitle: currentGrid.gridTitle, grid: currentGrid.grid };
    const players = Object.keys(currentGrid.players);
    const chameleon = getRandomValue(players);
    const restOfPlayers = players.filter((player) => player !== chameleon);
    rooms[roomId].inProgress = true;
    active_grids[roomId].grid = newGrid.grid;
    active_grids[roomId].gridTitle = newGrid.gridTitle;
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
          title: 'Found!',
          message: `The chameleon was found! ${currentGrid.chameleon} now gets a chance to pick the correct clue.`,
          type: 'success',
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
        title: 'Escaped',
        message: `The chameleon has escaped! Congrats to ${currentGrid.chameleon} and better luck next time for everyone else.`,
        type: 'info',
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
          title: 'Correct',
          message: `The chameleon guessed the CORRECT word. Congrats to ${chameleon} and better luck next time for everyone else.`,
          type: 'success',
        },
        { key: 'correctWord' }
      );
      rooms[roomId].players[chameleon] = currentRoom.players[chameleon] + 1;
    } else {
      io.in(roomId).emit(
        'toaster',
        {
          title: 'Wrong',
          message: `The chameleon guessed the WRONG word. ${chameleon} guessed ${word}. +1 for everyone else.`,
          type: 'error',
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

    active_grids[roomId].boardIsClickable = false;
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
      { title: 'Kicked Player', message: `Player ${playerName} was kicked from the room`, type: 'moreInfo' },
      { key: 'kickPlayer', playerName }
    );
  });

  socket.on('changeGrid', function (gridSelect) {
    if (!active_grids[roomId]) {
      return;
    }
    if (gridSelect !== 'random') {
      active_grids[roomId].grid = wordSheet[gridSelect];
      active_grids[roomId].gridTitle = gridSelect;
    }
    active_grids[roomId].gridSelect = gridSelect;
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

  socket.on('resetScores', function () {
    const currentGrid = active_grids[roomId];
    const currentRoom = rooms[roomId];
    if (!currentRoom || !currentGrid) {
      return;
    }
    const players = Object.keys(currentRoom.players);
    active_grids[roomId].boardIsClickable = false;
    rooms[roomId].inProgress = false;
    rooms[roomId].players = players.reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: 0,
      }),
      {}
    );
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
  const highestVote = Object.keys(votes).reduce((prev, cur) => {
    if (votes[prev] === votes[cur]) {
      highestNum = 'tie';
      return prev;
    }
    if (votes[prev] > votes[cur]) {
      highestNum = votes[prev];
      return prev;
    }

    highestNum = votes[cur];
    return cur;
  }, highestNum);

  if (highestVote !== currentGrid.chameleon || highestNum === 'tie') {
    chameleonEscapes = true;
  }

  return chameleonEscapes;
}
