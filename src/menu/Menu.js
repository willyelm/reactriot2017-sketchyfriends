import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client'
import { CREATE_ROOM, JOIN_ROOM } from '../store';

const socket = io.connect(`http://localhost:8000`)

class Menu extends Component {

  componentDidMount() {    
    
  }

  constructor(props) {
    super(props)

    this.state = {
      input: ''
    }

    socket.on(`message`, data => {
      console.log(data)
      switch(data.OP) {
        case 'CREATE':
          this.props.create_room(data.CODE);
          this.props.history.push('/lobby');
          break;
        case 'JOIN':
          this.props.join_room(data.CODE);
          this.props.history.push('/game');
          break;
        case 'PLAYER2_JOINED':
          this.props.history.push('/game');
          break;
      }
      
    });
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }

  startAGame() {
    socket.emit('message', { OP: 'CREATE' });
  }

  joinAGame() {
    console.log(this.state.input)
    socket.emit('message', { OP: 'JOIN', code: this.state.input });
  }

  render() {
    return (
      <div className="Menu">
        <h1>Sketchy Friends</h1>
        <button type="button" onClick={ this.startAGame.bind(this) }>Start a Game</button>
        <input type="text" placeholder="game code" onChange={ this.handleChange.bind(this) } value={ this.state.input } />
        <button type="button" onClick={ this.joinAGame.bind(this) }>Join a Game</button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    create_room: code => {
      dispatch({ type: CREATE_ROOM, code });
    },
    join_room: code => {
      dispatch({ type: JOIN_ROOM, code });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(Menu);
export default ConnectedMenu;
