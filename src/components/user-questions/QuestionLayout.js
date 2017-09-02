import React from 'react';
import Hello from './userQuestion.js';
import styled from 'styled-components';
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
      <Hello />
    </StayVisible>
    )
  }
}

export default QuestionLayout;
