const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const wordSheet = require('./consts/wordSheet.js');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
// for scaling if we need more CPU cores https://github.com/mars/heroku-nextjs-custom-server-express/blob/master/server.js

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const fakeRooms = {
  fakeRoom1: {
    host: 'poop',
    players: {
      poop: 0,
      stinky: 0,
      silly: 0,
      wormy: 0,
    },
    inProgress: false,
    full: false,
  },
  fakeRoom2: {
    host: 'eli',
    players: {
      eli: 2,
      atlas: 2,
      mommy: 2,
      daddy: 2,
    },
    inProgress: true,
    full: false,
  },
  fakeRoom3: {
    host: 'a',
    players: {
      a: 1,
      b: 0,
      c: 4,
      d: 0,
      e: 2,
      f: 0,
      g: 0,
      h: 3,
      i: 0,
      j: 0,
    },
    inProgress: true,
    full: true,
  },
  fakeRoom4: {
    host: 'me',
    players: {
      me: 0,
      you: 0,
    },
    inProgress: false,
    full: false,
  },
  fakeRoom5: {
    host: 'me',
    players: {
      me: 0,
      you: 0,
    },
    inProgress: false,
    full: false,
  },
};
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
// }

// grid by room
const active_grids = {};
// roomId: {
//   grid: string,
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
  return {
    gridTitle: randomTitle,
    grid: gridTitles[randomTitle],
  };
}

// ======================
// socket.io
// ======================

io.on('connection', function (socket) {
  socket.emit('connected', { playersOnline: users.length, connected: true });

  // locals
  let username;
  let roomId;

  // exit room
  function exit() {
    socket.to(roomId).emit('updateonline', rooms[roomId]);
    socket.leave(roomId);

    if (rooms[roomId] && rooms[roomId].players.length === 0) {
      delete rooms[roomId];
      delete active_grids[roomId];
    }

    username = undefined;
    roomId = undefined;
  }

  // disconnect
  socket.on('disconnect', function () {
    console.log('A user is leaving: ' + username);
    if (username !== undefined) {
      removeUser(username, users);
    }
    if (username !== undefined && roomId !== undefined) {
      removeUser(username, rooms[roomId]);
      exit();
    }
  });

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

  socket.on('requestroom', function (args) {
    const requestedRoom = args[0];
    roomId = requestedRoom;

    if (rooms[roomId] === undefined) {
      const newGrid = randomGrid();
      rooms[roomId] = {
        host: username,
        players: [username],
        grid: newGrid.grid,
        gridTitle: newGrid.gridTitle,
      };
      active_grids[roomId] = newGrid.grid;
    } else if (rooms[roomId].players.length >= MAX_PLAYERS) {
      socket.emit('roomfull', rooms[roomId]);
      return;
    } else {
      rooms[roomId].players.push(username);
      if (rooms[roomId].players.length === MAX_PLAYERS) {
        rooms[roomId].full = true;
      }
    }

    socket.join(roomId);
    io.in(roomId).emit('updateonline', rooms[roomId]);
    socket.emit('deploygrid', active_grids[roomId]);
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
  // app.get("/messages/:chat", (req, res) => {
  //   res.json(messages[req.params.chat]);
  // });

  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
