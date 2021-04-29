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
    privateRoom: true,
  },
};

module.exports = fakeRooms;
