import React from 'react';
import AppBar from 'material-ui/AppBar';
import styled from 'styled-components';
import RaisedButton from 'material-ui/RaisedButton';

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

export const NavAppBar = (props) => {
      return(
      <StayVisible
      {...props}
      >
        <AppBar
          title="StudentAdda"
          onLeftIconButtonTouchTap={props.toggle}
          iconElementRight={<RaisedButton label="Logout" secondary={true}/>}
          onRightIconButtonTouchTap={props.logout}
          zDepth = {-1}
          />
      </StayVisible>
      )
}
