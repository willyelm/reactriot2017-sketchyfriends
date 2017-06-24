import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client'
import { CREATE_ROOM } from '../store';

const socket = io.connect(`http://localhost:8000`)

class Menu extends Component {

  componentDidMount() {    
    
  }

  constructor(props) {
    super(props)

    socket.on(`message`, data => {
      console.log(data)
      this.props.create_room(data.CODE);
      this.props.history.push('/lobby');
    })
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }

  startAGame() {
    socket.emit('message', { OP: 'CREATE' });
  }

  render() {
    return (
      <div className="Menu">
        <h1>Sketchy Friends</h1>
        <button type="button" onClick={ this.startAGame.bind(this) }>Start a Game</button>
        <input type="text" />
        <button>Join a Game</button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    create_room: code => {
      dispatch({ type: CREATE_ROOM, code });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(Menu);
export default ConnectedMenu;
