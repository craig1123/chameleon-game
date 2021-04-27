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

// fake DB - probably don't need a db
// ======
// globals
// ======
const MAX_PLAYERS = 10;
// an array of all users
const users = [];
// user by room
const rooms = {};
// {
//   host: Username,
//   players: Username[],
//   grid: string[],
//   gridTitle: string,
//   full: boolean
// }
// grid by room
const active_grids = {};

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
  console.log('A user connected.');

  // locals
  const username;
  const room;

  // exit room
  function exit() {
    socket.to(room).emit('updateonline', rooms[room]);
    socket.leave(room);

    if (rooms[room] && rooms[room].players.length === 0) {
      delete rooms[room];
      delete active_grids[room];
    }

    username = undefined;
    room = undefined;
  }

  // disconnect
  socket.on('disconnect', function () {
    if (username !== undefined && room !== undefined) {
      removeUser(username, users);
      removeUser(username, rooms[room]);
      exit();
    }
  });

  // leaveroom event
  socket.on('leaveroom', function () {
    removeUser(username, rooms[room]);
    exit();
  });

  socket.on('requestuser', function (args) {
    const requested_username = args[0];
    console.log('A user requested sign up: ' + requested_username);

    if (!userNameExists(requested_username)) {
      socket.emit('usernametaken');
      return;
    }

    username = requested_username;
    users.push(username);
    socket.emit('acceptuser', [username, users.length]);
  });

  socket.on('requestroom', function (args) {
    const requested_room = args[0];
    room = requested_room;

    if (rooms[room] === undefined) {
      const newGrid = randomGrid();
      rooms[room] = {
        host: username,
        players: [username],
        grid: newGrid.grid,
        gridTitle: newGrid.gridTitle,
      };
      active_grids[room] = newGrid.grid;
    } else if (rooms[room].players.length >= MAX_PLAYERS) {
      socket.emit('roomfull', active_grids[room]);
      return;
    } else {
      rooms[room].players.push(username);
      if (rooms[room].players.length === MAX_PLAYERS) {
        rooms[room].full = true;
      }
    }

    socket.join(room);
    io.in(room).emit('updateonline', rooms[room]);
    socket.emit('deploygrid', active_grids[room]);
  });

  // changegrid event
  socket.on('changegrid', function () {
    const newGrid = randomGrid();
    active_grids[room].grid = newGrid.grid;
    active_grids[room].gridTitle = newGrid.gridTitle;
    io.in(room).emit('deploygrid', active_grids[room]);
  });

  // assign roles event
  socket.on('assignroles', function () {
    const chameleonIndex = getRandomChoice(rooms[room].length);
    const chameleonName = rooms[room][chameleonIndex];
    const wordIndex = getRandomChoice(active_grids[room].length);
    const word = active_grids[room][wordIndex];
    io.in(room).emit('giveassigment', [word, chameleonName]);
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
