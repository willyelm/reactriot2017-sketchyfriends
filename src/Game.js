import React, { Component } from 'react';
import Canvas from './Canvas';

class Game extends Component {

  constructor(props) {
    super(props)

    this.state = {
      input: '',
    }
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }

  handleClick() {
    this.setState({
      guess: this.state.input,
      input: ''
    });
  }

  render() {
    return (
      <div className="Game">
        <h1>Sketchy Friends</h1>
        <Canvas />
        <p>{ this.state.guess }</p>
        <input type="text" onChange={ this.handleChange.bind(this) } value={ this.state.input } />
        <button onClick={ this.handleClick.bind(this) } type="button">Submit</button>
      </div>
    );
  }
}

export default Game;
