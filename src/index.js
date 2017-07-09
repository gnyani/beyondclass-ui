import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
//import App from './App';
import Header from './Header';
import injectTapEventPlugin from 'react-tap-event-plugin';

//import registerServiceWorker from './registerServiceWorker';

injectTapEventPlugin();

ReactDOM.render(
  <HashRouter>
  <Header />
</HashRouter>, document.getElementById('header'));


// ReactDOM.render(
//   <HashRouter>
//   <App />
// </HashRouter>, document.getElementById('body'));
//egisterServiceWorker();
