import React, { Component } from 'react';
import Canvas from './Canvas';

class Game extends Component {
  render() {
    return (
      <div className="Game">
        <h1>Sketchy Friends</h1>
        <Canvas />
      </div>
    );
  }
}

export default Game;
