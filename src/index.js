import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Router from './components/Router.js';
import Notifications from 'react-notify-toast';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Style from './styles/student-adda.css';

//import registerServiceWorker from './registerServiceWorker';

injectTapEventPlugin();

ReactDOM.render(
  <HashRouter>
  <MuiThemeProvider>
  <div>
    <Notifications options={{zIndex: 5000}}/>
    <Router className={Style.StudentAdda} />
  </div>
  </MuiThemeProvider>
</HashRouter>, document.getElementById('router'));

// ReactDOM.render(
//   <HashRouter>
//   <App />
// </HashRouter>, document.getElementById('body'));
//egisterServiceWorker();
