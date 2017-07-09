import React from 'react';
import HorizontalTimelineContent from './HorizontalTimelineContent';
import GameInfo from './dates.js';
import styled from 'styled-components';

// Directly importing the minified bootstrap css to avoid all the painful
// steps it will take otherwise to get it to work.
//import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

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
       console.log("date is" + game.date)
      return ({
        date: game.date
      });
    });
  }

  render() {
    return (
      <StayVisible
        {...this.props}
      >
      <HorizontalTimelineContent
        content={this.data} />
    </StayVisible>
    );
  }
}

export default TimeLine
