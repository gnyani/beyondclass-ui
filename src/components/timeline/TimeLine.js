import React from 'react';
import HorizontalTimelineContent from './HorizontalTimelineContent';
import GameInfo from './dates.js';
import styled from 'styled-components';
import {Grid,Row,Col} from 'react-flexbox-grid'
import UnauthorizedPage from '../UnauthorizedPage.js'
import {Media} from '../utils/Media'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
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
      <Grid fluid>
      <Row around="xs">
      <Col xs={12} sm={12} md={11} lg={10}>
      <HorizontalTimelineContent
        content={this.data} loggedinuser={this.props.loggedinuser}/>
      </Col>
      </Row>
      </Grid>
    </StayVisible>
    );
  }else{
    return(<UnauthorizedPage />)
  }
}
}

export default TimeLine
