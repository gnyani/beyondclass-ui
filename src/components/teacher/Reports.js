import React,{Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`
class Reports extends Component{
  render(){
    return(
      <StayVisible
      {... this.props}>
      <div>
      <p>Hello World {this.props.assignmentid}</p>
      </div>
      </StayVisible>)
  }
}
export default Reports
