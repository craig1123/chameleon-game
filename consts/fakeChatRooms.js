const fakeChatRooms = {
  fakeRoom1: [
    {
      username: 'craig',
      message: 'How are you?',
      timestamp: Date.now(),
    },
    {
      username: 'stinky',
      message: "I'm doing great!",
      timestamp: Date.now(),
    },
    {
      username: 'silly',
      message: 'Same 😂',
      timestamp: Date.now(),
    },
    {
      username: 'craig',
      message: 'Well you guys are lame',
      timestamp: Date.now(),
    },
    {
      prevUser: 'craig',
      message: 'Sorry, not sorry',
      timestamp: Date.now(),
    },
    {
      prevUser: 'craig',
      message: '😂',
      type: 'emoji',
      timestamp: Date.now(),
    },
  ],
  Lobby: [
    {
      username: 'craig',
      message: 'How are you?',
      timestamp: Date.now(),
    },
    {
      username: 'stinky',
      message: "I'm doing great!",
      timestamp: Date.now(),
    },
    {
      username: 'silly',
      message: 'Same 😂',
      timestamp: Date.now(),
    },
    {
      username: 'craig',
      message: 'Well you guys are lame',
      timestamp: Date.now(),
    },
    {
      prevUser: 'craig',
      message: 'Sorry, not sorry',
      timestamp: Date.now(),
    },
    {
      prevUser: 'craig',
      message: '😂',
      type: 'emoji',
      timestamp: Date.now(),
    },
  ],
};

const dev = process.env.NODE_ENV !== 'production';

module.exports = dev ? fakeChatRooms : {};
