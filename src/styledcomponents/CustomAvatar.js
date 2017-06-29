import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {
  indigo900,
  orange700,
} from 'material-ui/styles/colors';

//const style = {margin: -9};

class CustomAvatar extends Component{
render(){
  return(
    <Avatar
      color={orange700}
      backgroundColor={indigo900}
      size={40}
    >
      SA
    </Avatar>
  )
}
}

export default CustomAvatar
