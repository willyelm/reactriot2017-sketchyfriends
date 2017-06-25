import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client'
import { CREATE_ROOM, JOIN_ROOM, SET_SOCKET } from '../store';

const socket = io.connect('https://sketchy-friends-socket.herokuapp.com/');

class Menu extends Component {

  componentDidMount() {
    this.props.set_socket(socket);

  }

  constructor(props) {
    super(props)
    this.input = '';
    this.state = {
      displayError: false,
      error: ''
    }

    socket.on(`message`, data => {
      switch(data.OP) {
        case 'CREATE':
          this.props.create_room(data);
          this.props.history.push('/lobby');
          break;
        case 'JOIN':
          if(data.SUCCESS) {
            this.props.join_room(data);
            this.props.history.push('/game');
          } else {
            this.setState({
              displayError: true,
              error: data.REASON
            });
            setTimeout(() => {
              this.setState({
                displayError: false
              });
            },3000)
          }
          break;
        case 'PLAYER2_JOINED':
          this.props.history.push('/game');
          break;
        default:
          break;
      }
      
    });
  }

  handleChange(e) {
    this.input = e.target.value;
  }

  startAGame() {
    socket.emit('message', { OP: 'CREATE' });
  }

  joinAGame() {
    socket.emit('message', { OP: 'JOIN', code: this.input });
  }

  render() {
    const currentPath = window.location.pathname;
    return (
        (currentPath === '/') ?  (
          <div className="Menu">
            <h1>Sketchy Friends</h1>
            <p className={ this.state.displayError ? "warning" : "warning hidden"}>{ this.state.error }</p>
            <div>
              <button type="button" onClick={ this.startAGame }>Start a Game</button>
              <p>or</p>
              <input type="text" placeholder="enter game code" onChange={ this.handleChange.bind(this) }/>
              <button type="button" onClick={ this.joinAGame.bind(this) }>Join Game</button>
            </div>
          </div>
        ) : null
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    create_room: data => {
      dispatch({ type: CREATE_ROOM, code: data.CODE, sketchy: data.SKETCHY });
    },
    set_socket: socket => {
      dispatch({ type: SET_SOCKET, socket });
    },
    join_room: data => {
      dispatch({ type: JOIN_ROOM, code: data.CODE, sketchy: data.SKETCHY  });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(Menu);
export default ConnectedMenu;
