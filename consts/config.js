const prod = process.env.NODE_ENV === 'production';

const config = {
  development: !prod,
  ga: prod ? 'G-PKG6DHM8QM' : '',
  url: prod ? 'https://the-chameleon.onrender.com' : 'http://localhost:3000',
};

export default config;
