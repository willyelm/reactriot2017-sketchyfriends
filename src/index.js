import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Menu from './menu/Menu';
import Game from './game/Game';
import Lobby from './lobby/Lobby';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App path="/">
      <Route path="/menu" component={Menu}/>
      <Route path="/lobby" component={Lobby}/>
      <Route path="/game" component={Game}/>
    </App>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
