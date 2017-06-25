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
      opponentPoints: 0,
      time: null,
      chatHistory: []
    }
    this.count = 3;

    this.props.socket.on('message', data => {
      switch(data.OP) {
        case 'NEW_WORD':
          this.props.set_new_word(data.WORD);
          this.setState({ word: data.WORD });
          this.goodDraw = false;
          this.correctAnswer = false;
          break;
        case 'SKETCHY_PLAYER':
          this.props.set_sketchy_friend(data.SKETCHY);
          this.setState({
            sketchy: data.SKETCHY
          });
          break;
        case 'GOOD_DRAW':
          this.setState({
            points: data.POINTS,
            opponentPoints: data.OPPONENT_POINTS
          });
          this.goodDraw = true;
          setTimeout(() => {
            this.props.socket.emit('message', { OP: 'END_ROUND' });
          },3000);
          break;
        case 'CORRECT_ANSWER':
          this.setState({
            points: data.POINTS,
            opponentPoints: data.OPPONENT_POINTS
          });
          this.correctAnswer = true;
          break;
        case 'TIMER':
          this.setState({
            time: data.TIME,
          });
          if(this.state.time === null && this.state.sketchy) {
            this.props.socket.emit('message', { OP: 'END_ROUND' });
          }
          break;
        case 'CHAT':
          let player;
          if(parseInt(data.PLAYER_NUM) === parseInt(this.props.playerNumber)) {
            player = 'you';
          } else {
            player = 'friend';
          }
          let chatHistory = this.state.chatHistory;
          chatHistory.push({ player, message: data.DATA });

          this.setState({
            chatHistory,
          });
          if(this.state.time === null && this.state.sketchy) {
            this.props.socket.emit('message', { OP: 'END_ROUND' });
          }
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

  // checkAnswer(e) {
  //   this.setState({ input: e.target.value });
  // }

  checkAnswer(e) {
    if (e.key === 'Enter') {
      if(e.target.value.toLowerCase() === this.state.word && !this.state.sketchy) {
        this.props.socket.emit('message', { OP: 'CORRECT_ANSWER' });
      }
      this.props.socket.emit('message', { OP: 'CHAT', value: e.target.value });
      e.target.value = '';
    }
  }

  render() {
    return (
      <div className="Game">
        <div className="game-header">
          <p className={ this.state.sketchy ? "sketchy-word" : "sketchy-word hidden" }>{ this.state.word }</p>
          <p className={ this.state.sketchy ? "hidden" : "" }>Guess the secret word!</p>
        </div>
        
        <div className={ this.state.gameCountDown === null ? "modal hidden" : "modal" }>
          <p>Game starts in { this.state.gameCountDown }</p>
        </div>
        <div className={ this.state.time <= 5 ? "timer warning" : "timer" }>
          <p>{ this.state.time === null ? 10 : this.state.time }</p>
        </div>
        <div className={ this.goodDraw ? "modal" : "modal hidden" }>
          <p>You're an artist!</p>
        </div>
        <div className={ this.correctAnswer ? "modal" : "modal hidden" }>
          <p>You got it!</p>
        </div>

        <div className="players">
          <div>
            <p>You</p>
            <p>{ this.state.points } PTS</p>
          </div>
          <div>
            <p>Friend</p>
            <p>{ this.state.opponentPoints } PTS</p>
          </div>
        </div>
        <Canvas />

        <div className="chat">
          <div className="chat-history">
            {
              (this.state.chatHistory) ?  (
                this.state.chatHistory.map((data) =>  {
                  return <p><span className={ data.player }>{ data.player }:</span> { data.message }</p>
                })
              ) :  null
            }
          </div>
          <input type="text" onKeyPress={ this.checkAnswer.bind(this) }/>
        </div>
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
