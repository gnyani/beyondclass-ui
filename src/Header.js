import React, { Component } from 'react';
import HeaderComponent from './components/HeaderComponent.js';
import Notifications from 'react-notify-toast';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Header extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <div>
        <Notifications options={{zIndex: 5000}}/>
        <HeaderComponent />
      </div>
      </MuiThemeProvider>
    );
  }
}

export default Header;
