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

// remove a user from an array
function removeUser(username, array) {
  const index = array.indexOf(username);
  // if we found a use remove them
  if (index > -1) {
    array.splice(index, 1);
  }
}

// is a username available?
function userNameExists(username) {
  return users.indexOf(username) > -1;
}

// get a random grid
function randomGrid() {
  const randomTitle = getRandomChoice(gridTitlesLength);
  const gridTitle = gridTitles[randomTitle];
  return {
    gridTitle: gridTitle,
    grid: wordSheet[gridTitle],
  };
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
  function exit() {
    socket.to(roomId).emit('updateRoom', { roomState: rooms[roomId] });
    socket.leave(roomId);

    if (rooms[roomId] && rooms[roomId].players.length === 0) {
      delete rooms[roomId];
      delete active_grids[roomId];
    }

    username = undefined;
    roomId = undefined;
  }

  function removePlayer() {
    if (username !== undefined) {
      console.log('A user is leaving: ' + username);
      removeUser(username, users);
      username = undefined;
    }
    if (username !== undefined && roomId !== undefined) {
      removeUser(username, rooms[roomId]);
      exit();
    }
  }

  // disconnect
  socket.on('removePlayer', removePlayer);
  socket.on('disconnect', removePlayer);

  // leaveroom event
  socket.on('leaveroom', function () {
    removeUser(username, rooms[roomId]);
    exit();
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
        host: username,
        players: [username],
        privateRoom,
        chameleonSeeClues,
        pointsForGuessing,
      };
      active_grids[requestedRoom] = {
        grid: newGrid.grid,
        gridTitle: newGrid.gridTitle,
        keyWord: '',
        chameleon: '',
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
    } else if (rooms[requestedRoom].players.length >= MAX_PLAYERS) {
      socket.emit('roomFull', rooms);
      return;
    } else if (rooms[requestedRoom] && active_grids[requestedRoom]) {
      roomId = requestedRoom;
      rooms[roomId].players.push(username);
      active_grids[roomId].players[username] = {
        clue: '',
        clueReady: false,
        vote: '',
      };
      if (rooms[roomId].players.length === MAX_PLAYERS) {
        rooms[roomId].full = true;
      }
      socket.join(roomId);
      io.in(roomId).emit('updateRoom', { roomState: rooms[roomId], gameState: active_grids[roomId] });
      socket.emit('acceptJoinGame', requestedRoom);
    }
  });

  // changegrid event
  socket.on('changegrid', function () {
    const newGrid = randomGrid();
    active_grids[roomId].grid = newGrid.grid;
    active_grids[roomId].gridTitle = newGrid.gridTitle;
    io.in(roomId).emit('deploygrid', active_grids[roomId]);
  });

  // assign roles event
  socket.on('assignroles', function () {
    const chameleonIndex = getRandomChoice(rooms[roomId].length);
    const chameleonName = rooms[roomId][chameleonIndex];
    const wordIndex = getRandomChoice(active_grids[roomId].length);
    const word = active_grids[roomId][wordIndex];
    io.in(roomId).emit('giveassigment', [word, chameleonName]);
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
