import React,{Component} from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui/Tabs'
import StudentTeacherAnnouncements from './StudentTeacherAnnouncements.js'
import StudentTeacherAssignments from './StudentTeacherAssignments.js'
import UnauthorizedPage from '../UnauthorizedPage.js'


const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

class TeacherStudentSpace extends Component{

  constructor(props) {
     super(props);
     this.state = {
       value: 'announcements',
     };
   }

   handleChange = (value) => {
     this.setState({
       value: value,
     });
   };
  render(){
    if(this.props.userrole==="student")
    {
    return(
      <StayVisible
      {...this.props}>
      <div>
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
      >
        <Tab label="Announcements" value="announcements">
          <div>
            <StudentTeacherAnnouncements class={this.props.year+'-'+this.props.section} />
          </div>
        </Tab>
        <Tab label="Assignments" value="assignments">
          <StudentTeacherAssignments class={this.props.year+'-'+this.props.section} />
        </Tab>
      </Tabs>
      </div>
      </StayVisible>
    )
  }
  else{
    return(<UnauthorizedPage />)
  }
}
}
export default TeacherStudentSpace;
