import React, { Component } from 'react';
import { connect } from 'react-redux';

class Lobby extends Component {

  render() {
    return (
      <div className="Lobby">
        <div className="lobby-content">
          <p>Share this code with a friend!</p>
          <p className="code">{ this.props.code }</p>
          <p>Waiting for sketchy friend...</p>
        </div>
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
