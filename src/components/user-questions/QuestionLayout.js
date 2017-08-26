import React from 'react';
import Hello from './userQuestion.js';
import styled from 'styled-components';

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
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
