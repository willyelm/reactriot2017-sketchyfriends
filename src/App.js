import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div className="container content">
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default App;
