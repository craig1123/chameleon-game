const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// fake DB - probably don't need a db
// ======
// globals
// ======

// an array of all users
const users = [];
// users by room
const rooms = {};
// grid by room
const active_grids = {};

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
function isUsernameAvailable(username) {
  const index = users.indexOf(username);
  if (index > -1) {
    return false;
  } else {
    return true;
  }
}

// get a random grid
function randomGrid() {
  return grids[getRandomChoice(grids.length)];
}

// ======================
// socket.io
// ======================

io.on("connection", function (socket) {
  console.log("A user connected.");

  // locals
  const username;
  const room;

  // disconnect
  socket.on("disconnect", function () {
    if (username !== undefined && room !== undefined) {
      removeUser(username, users);
      removeUser(username, rooms[room]);
      exit();
    }
  });

  // leaveroom event
  socket.on("leaveroom", function () {
    removeUser(username, rooms[room]);
    exit();
  });

  // exit room
  function exit() {
    socket.to(room).emit("updateonline", rooms[room]);
    socket.leave(room);
    if (rooms[room].length === 0) {
      delete rooms[room];
      delete active_grids[room];
    }
    username = undefined;
    room = undefined;
  }

  // requestuser event
  socket.on("requestuser", function (args) {
    const requested_username = args[0];
    const requested_room = args[1];
    console.log("A user requested sign up: " + requested_username);
    if (!isUsernameAvailable(requested_username)) {
      console.log("Username taken.");
      socket.emit("usernametaken");
      return;
    }
    username = requested_username;
    room = requested_room;
    users.push(username);
    if (rooms[room] === undefined) {
      rooms[room] = [username];
      active_grids[room] = randomGrid();
    } else {
      rooms[room].push(username);
    }
    socket.join(room);
    socket.emit("acceptuser", [username, room]);
    io.in(room).emit("updateonline", rooms[room]);
    socket.emit("deploygrid", active_grids[room]);
  });

  // changegrid event
  socket.on("changegrid", function () {
    active_grids[room] = randomGrid();
    io.in(room).emit("deploygrid", active_grids[room]);
  });

  // assign roles event
  socket.on("assignroles", function () {
    const chameleonIndex = getRandomChoice(rooms[room].length);
    const chameleonName = rooms[room][chameleonIndex];
    const wordIndex = getRandomChoice(active_grids[room].length);
    const word = active_grids[room][wordIndex];
    io.in(room).emit("giveassigment", [word, chameleonName]);
  });
});

nextApp.prepare().then(() => {
  // app.get("/messages/:chat", (req, res) => {
  //   res.json(messages[req.params.chat]);
  // });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
