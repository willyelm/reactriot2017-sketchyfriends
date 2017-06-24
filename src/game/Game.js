import React, { Component } from 'react';
import { connect } from 'react-redux';
import Canvas from './Canvas';
import '../App.css';
import { SET_NEW_WORD, SET_SKETCHY_FRIEND } from '../store';

class Game extends Component {

  constructor(props) {
    super(props)

    this.state = {
      input: '',
      gameCountDown: 3,
      word: null,
      sketchy: this.props.sketchy,
      points: 0,
      opponent_points: 0
    }
    this.count = 3;
    this.drawCount = 10;
    this.pauseTimer = false;

    this.props.socket.on('message', data => {
      console.log(data)
      switch(data.OP) {
        case 'NEW_WORD':
          this.props.set_new_word(data.WORD);
          this.setState({ word: data.WORD });
          this.setState({ drawCount: 10 });
          this.drawCounter = setInterval(this.drawTimer.bind(this), 1000);
          break;
        case 'SKETCHY_PLAYER':
          this.props.set_sketchy_friend(data.SKETCHY);
          this.setState({ //why does this need to be done if props are being dispatched? 
            sketchy: data.SKETCHY
          });
          break;
        case 'GOOD_DRAW':
          this.setState({
            points: data.POINTS,
            opponent_points: data.OPPONENT_POINTS
          });
          this.goodDraw = true;
          setTimeout(() => {
            this.props.socket.emit('message', { OP: 'END_ROUND' });
          },3000);
          break;
        case 'CORRECT_ANSWER':
          this.setState({
            points: data.POINTS,
            opponent_points: data.OPPONENT_POINTS
          });
          this.correctAnswer = true;
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

  drawTimer() {
    console.log('start timer')
    this.drawCount=this.drawCount-1;
    if (this.drawCount <= 0) {
      clearInterval(this.drawCounter);
      this.drawCount = null;
      this.setState({ drawCountDown: this.drawCount });
      if(!this.props.sketchy) {
        console.log('round end')
        this.props.socket.emit('message', { OP: 'END_ROUND' });
      }
      return;
    }
    this.setState({ drawCountDown: this.drawCount });
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }

  checkAnswer() {
    if(this.state.input.toLowerCase() === this.state.word) {
      this.props.socket.emit('message', {  OP: 'CORRECT_ANSWER' });
      clearInterval(this.drawCounter);
    }
  }

  render() {
    return (
      <div className="Game">
        <h1>Sketchy Friends</h1>
        <div className={ this.state.gameCountDown === null ? "hidden" : "" }>
          <p>Game starts in { this.state.gameCountDown }</p>
        </div>
        <div className={ this.state.drawCountDown === null ? "hidden" : "" }>
          <p>{ this.state.drawCountDown }</p>
        </div>
        <div className={ this.state.goodDraw ? "" : "hidden" }>
          <p>You're an artist!</p>
        </div>
        <div className={ this.state.correctAnswer ? "" : "hidden" }>
          <p>You got it!</p>
        </div>

        <p className={ this.state.sketchy ? "sketchy-word" : "sketchy-word hidden" }>{ this.state.word }</p>
        <p className={ this.state.sketchy ? "hidden" : "" }>Guess the secret word!</p>
        <div>
          <div>
            <p>Player 1</p>
            <p>{ this.state.points }</p>
          </div>
          <div>
            <p>Player 2</p>
            <p>{ this.state.opponent_points }</p>
          </div>
        </div>
        <Canvas />
        <input type="text" onChange={ this.handleChange.bind(this) } className={ this.state.sketchy ? "hidden" : "" }/>
        <button onClick={ this.checkAnswer.bind(this) } type="button" className={ this.state.sketchy ? "hidden" : "" }>Submit</button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    set_new_word: word => {
      dispatch({ type: SET_NEW_WORD, word  });
    },
    set_sketchy_friend: sketchy => {
      dispatch({ type: SET_SKETCHY_FRIEND, sketchy  });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedGame = connect(mapStateToProps, mapDispatchToProps)(Game);
export default ConnectedGame;
