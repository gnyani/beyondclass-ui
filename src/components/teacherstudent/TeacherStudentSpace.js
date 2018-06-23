import React,{Component} from 'react'
import Loadable from 'react-loadable'
import Loading from '../Loading'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui/Tabs'
import ListAssignments from './ListAssignments'
import ListHandouts from './ListHandoutsStudent'
import {Media} from '../utils/Media'

const StudentTeacherAnnouncements = Loadable({
  loader: () => import('./StudentTeacherAnnouncements'),
  loading: Loading,
  timeout: 10000,
})

const UnauthorizedPage = Loadable({
  loader: () => import('../UnauthorizedPage'),
  loading: Loading,
  timeout: 10000,
})

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
       value: 'assignments',
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
        inkBarStyle={{backgroundColor:"#FFA107"}}
      >
      <Tab label="Assignments" value="assignments" buttonStyle={{backgroundColor: '#4d86cf'}}>
        <ListAssignments email={this.props.loggedinuser}   />
      </Tab>
        <Tab label="Announcements" value="announcements" buttonStyle={{backgroundColor: '#4d86cf'}}>
            <StudentTeacherAnnouncements class={this.props.startyear+'-'+this.props.section} />
        </Tab>
        <Tab label="Handouts" value="handouts" buttonStyle={{backgroundColor: '#4d86cf'}}>
            <ListHandouts class={this.props.startyear+'-'+this.props.section} userrole={this.props.userrole} branch={this.props.branch}/>
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
