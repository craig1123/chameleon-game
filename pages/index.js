import React from "react";
import Game from "../modules/Game";

const Home = (props) => {
  return <Game />;
};

// Home.getInitialProps = async () => {
//   const response = await fetch("http://localhost:3000/messages/chat1");
//   const messages = await response.json();

//   return { messages };
// };

export default Home;
