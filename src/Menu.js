import React, { Component } from 'react';

class Menu extends Component {

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
      <div className="Menu">
        <h1>Sketchy Friends</h1>
        <button>Start a Game</button>
        <input type="text" />
        <button>Join a Game</button>
      </div>
    );
  }
}

export default Menu;
