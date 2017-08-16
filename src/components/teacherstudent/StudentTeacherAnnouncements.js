import React,{Component} from 'react'
import {Grid,Row,Cell} from 'react-inline-grid'


var properties = require('../properties.json');

class StudentTeacherAnnouncements extends Component{

  constructor(){
    super();
    this.state={
      announcements: [],
      teachernames: [],
    }
  }

  list(buffer){
    for (let i=0;i<this.state.announcements.length;i++){
      buffer.push(
                    <Grid key={i} className="announcements">
                    <Row is="start">
                    <Cell is="4 tablet-4 phone-4"><div>
                    <li >
                    <p className="fontStyle">{this.state.teachernames[i]}:</p>
                    </li>
                    </div></Cell>
                    <Cell is="7 tablet-7 phone-7"><div>
                    <p className="messageStyle" style={{float:"left"}}>{this.state.announcements[i]} </p>
                    </div></Cell>
                    </Row>
                    </Grid>

                 )
  }
  return buffer;
  }

  populateData(pageNumber){
    fetch('http://'+properties.getHostName+':8080/teacher/student/announcements/list/'+this.props.class+'?pageNumber='+pageNumber, {
             credentials: 'include',
             method: 'GET'
          }).then(response => {
            return response.json()
          }).then(response => {
            var newmessage = []
            var newannouncementIds =[]
            var newTeacherNames = []
            for(let i=0;i<response.content.length;i++)
             { newmessage.push(response.content[i].message)
               newannouncementIds.push(response.content[i].announcementid)
               newTeacherNames.push(response.content[i].user.firstName+response.content[i].user.lastName)}
             this.setState({
                 announcementIds: newannouncementIds,
                 announcements: newmessage,
                 teachernames: newTeacherNames,
                 total: response.totalPages
           })
          })
  }

  componentWillMount(){
    this.populateData(1)
  }

  render(){
    var buffer = [];
    return(
      <div className="announcements">
      <h2 className="heading">Announcements from your teachers</h2>
      <div  className="container page">
         <ul>{this.list(buffer)}</ul>
       </div>
      </div>
    )
  }
}
export default StudentTeacherAnnouncements;
