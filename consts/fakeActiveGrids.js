const wordSheet = require('./wordSheet.js');

const fakeActiveGrids = {
  fakeRoom1: {
    grid: wordSheet.Artists,
    gridTitle: 'Artists',
    keyWord: 'Michelangelo',
    chameleon: 'stinky',
    players: {
      poop: {
        clue: 'david',
        clueReady: true,
        vote: 'wormy',
      },
      stinky: {
        clue: 'artist',
        clueReady: true,
        vote: 'wormy',
      },
      silly: {
        clue: 'sculpture',
        clueReady: true,
        vote: 'stinky',
      },
      wormy: {
        clue: 'old guy',
        clueReady: true,
        vote: 'stinky',
      },
      craig: {
        clue: 'no clue',
        clueReady: true,
        vote: 'stinky',
      },
      ryan: {
        clue: 'I have a clue',
        clueReady: true,
        vote: 'stinky',
      },
    },
  },
};

const dev = process.env.NODE_ENV !== 'production';

module.exports = dev ? fakeActiveGrids : {};
