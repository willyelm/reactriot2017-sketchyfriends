import React, { Component } from 'react';
import { connect } from 'react-redux';

class Lobby extends Component {

  constructor(props) {

    super(props);
    console.log(props)

    this.state = {
      input: ''
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
        <p>Share this code with a friend!</p>
        <p>{ this.props.code }</p>
        <p>Waiting for sketchy friend...</p>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  };
};

const mapStateToProps = (state) => state;
const ConnectedLobby = connect(mapStateToProps, mapDispatchToProps)(Lobby);
export default ConnectedLobby;
