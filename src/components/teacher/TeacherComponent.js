import React,{Component} from 'react';
import styled from 'styled-components';
import {Tabs, Tab} from 'material-ui/Tabs';
import TeacherAnnouncement from './TeacherAnnouncement.js';
import TeacherAssignmentUpload from './TeacherAssignmentUpload.js';
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

class TeacherComponent extends Component{
  constructor(props) {
     super(props);
     this.state = {
       value: 'announce',
     };
   }

   handleChange = (value) => {
     this.setState({
       value: value,
     });
   };
  render(){
  if(this.props.userrole==="teacher")
  {
    return(
      <StayVisible
      {...this.props}>
      <div>
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
      >
        <Tab label="Announce" value="announce">
          <div>
            <TeacherAnnouncement class={this.props.class} key={this.props.class}/>
          </div>
        </Tab>
        <Tab label="Assignments" value="assignments">
         <TeacherAssignmentUpload class={this.props.class} key={this.props.class}/>
        </Tab>
      </Tabs>
      </div>
      </StayVisible>
    )
  }else{
    return(<UnauthorizedPage />)
  }
}
}

export default TeacherComponent;
