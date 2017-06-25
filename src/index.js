import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Menu from './menu/Menu';
import Game from './game/Game';
import Lobby from './lobby/Lobby';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { store } from './store';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={ store }>
  	<BrowserRouter>
    	<App>
    	  <Route path="/" component={Menu} />
    	  <Route path="/lobby" component={Lobby}/>
    	  <Route path="/game" component={Game}/>
    	</App>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
