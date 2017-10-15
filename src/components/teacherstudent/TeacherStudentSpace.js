import React,{Component} from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui/Tabs'
import StudentTeacherAnnouncements from './StudentTeacherAnnouncements.js'
import DisplayAssignmentQuestions from './DisplayAssignmentQuestions.js'
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
            <StudentTeacherAnnouncements class={this.props.startyear+'-'+this.props.section} />
          </div>
        </Tab>
        <Tab label="Assignments" value="assignments">
          <DisplayAssignmentQuestions class={this.props.startyear+'-'+this.props.section} />
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
