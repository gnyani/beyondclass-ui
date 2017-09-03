import React from 'react';
import Hello from './userQuestion.js';
import styled from 'styled-components';
import {Grid,Row,Col} from 'react-flexbox-grid'
import {Media} from '../utils/Media'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

class QuestionLayout extends React.Component {

  componentWillMount() {
  }

  render(){
    return(
      <StayVisible
        {...this.props}
      >
      <Grid fluid>
      <Row around="xs">
      <Col xs={12} sm={12} md={11} lg={10}>
      <Hello />
      </Col>
      </Row>
      </Grid>
    </StayVisible>
    )
  }
}

export default QuestionLayout;
