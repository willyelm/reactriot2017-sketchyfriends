import React, { Component } from 'react';
import { connect } from 'react-redux';
import Canvas from './Canvas';
import '../App.css';
import { SET_NEW_WORD } from '../store';

class Game extends Component {

  constructor(props) {
    super(props)

    this.state = {
      input: '',
      gameCountDown: 3,
      word: null
    }
    this.count = 3;

    this.props.socket.on('message', data => {
      switch(data.OP) {
        case 'NEW_WORD':
          this.props.set_new_word(data.WORD);
          this.setState({ word: data.WORD });
          break;
        default:
          break;
      }
    });
  }

  componentDidMount() {
    this.counter=setInterval(this.timer.bind(this), 1000);
  }

  timer() {
    this.count=this.count-1;
    if (this.count <= 0) {
      clearInterval(this.counter);
      this.count = null;
      this.setState({ gameCountDown: this.count });
      if(this.props.sketchy) {
        this.props.socket.emit('message', { OP: 'START_GAME' });
      }
      return;
    }
    this.setState({ gameCountDown: this.count });
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }

  checkAnswer() {
    if(this.state.input.toLowerCase() === this.state.word) {
      console.log('correct')
    }
  }

  render() {
    return (
      <div className="Game">
        <h1>Sketchy Friends</h1>
        <div className={ this.state.gameCountDown === null ? "hidden" : "" }>
          <p>Game starts in { this.state.gameCountDown }</p>
        </div>
        <p className={ this.props.sketchy ? "sketchy-word" : "sketchy-word hidden" }>{ this.state.word }</p>
        <p className={ this.props.sketchy ? "hidden" : "" }>Guess the secret word!</p>
        <Canvas />
        <p>{ this.state.guess }</p>
        <input type="text" onChange={ this.handleChange.bind(this) } className={ this.props.sketchy ? "hidden" : "" }/>
        <button onClick={ this.checkAnswer.bind(this) } type="button" className={ this.props.sketchy ? "hidden" : "" }>Submit</button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    set_new_word: word => {
      dispatch({ type: SET_NEW_WORD, word  });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedGame = connect(mapStateToProps, mapDispatchToProps)(Game);
export default ConnectedGame;
