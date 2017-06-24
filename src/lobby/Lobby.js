import React, { Component } from 'react';

class Lobby extends Component {

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
    
  }

  render() {
    return (
      <div className="Lobby">
        <h1>Lobby</h1>
      </div>
    );
  }
}

export default Lobby;
