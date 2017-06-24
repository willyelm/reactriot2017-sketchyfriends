import React, { Component } from 'react';
import io from 'socket.io-client'

const socket = io.connect(`http://localhost:8000`)

class Menu extends Component {

  componentDidMount() {    
    socket.on(`server:news`, data => {
      socket.emit('my other event', { my: 'data' })
    })
  }

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
