import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Router from './components/Router.js';
import Notifications from 'react-notify-toast';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import  './styles/student-adda.css';


injectTapEventPlugin();

ReactDOM.render(
  <HashRouter>
  <MuiThemeProvider >
  <div className="vertical-scroll">
    <Notifications options={{zIndex: 5000}}/>
    <Router className="StudentAdda"/></div>
  </MuiThemeProvider>
</HashRouter>, document.getElementById('router'));
