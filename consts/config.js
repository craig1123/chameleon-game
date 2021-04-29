const config = {
  development: process.env.NODE_ENV !== 'production',
  url: process.env.NODE_ENV === 'production' ? 'https://the-chameleon.herokuapp.com' : 'http://localhost:3000',
};

export default config;
