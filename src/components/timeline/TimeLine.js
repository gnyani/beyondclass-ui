import React from 'react';
import HorizontalTimelineContent from './HorizontalTimelineContent';
import GameInfo from './dates.js';
import styled from 'styled-components';
import UnauthorizedPage from '../UnauthorizedPage.js'
const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

class TimeLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0, previous: 0 };
  }

  componentWillMount() {
    this.data = GameInfo.map((game, index) => {
      return ({
        date: game.date
      });
    });
  }

  render() {
  if(this.props.userrole==="student")
  {
    return (
      <StayVisible
        {...this.props}
      >
      <HorizontalTimelineContent
        content={this.data} loggedinuser={this.props.loggedinuser}/>
    </StayVisible>
    );
  }else{
    return(<UnauthorizedPage />)
  }
}
}

export default TimeLine
