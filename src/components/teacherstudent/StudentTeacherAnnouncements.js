import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'


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
    if(this.state.announcements.length === 0)
    buffer.push(<p key={new Date()} className="messageStyle" style={{textAlign:"center"}}>You are all caught up, you don't have any announcements yet</p>)
    else{
    for (let i=0;i<this.state.announcements.length;i++){
      buffer.push(
                    <Grid fluid key={i} className="announcements">
                    <Row >
                    <Col xs={12} sm={12} md={12} lg={12}>
                    <li >
                    <p className="name"> <span className="fontStyle">{this.state.teachernames[i]} </span>: <span className="messageStyle">{this.state.announcements[i]}</span> </p>
                    </li>
                    </Col>
                    </Row>
                    </Grid>

                 )
  }
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
      <h2 className="paragraph">Announcements from your teachers</h2>
      <div  className="container page">
         <ul>{this.list(buffer)}</ul>
       </div>
      </div>
    )
  }
}
export default StudentTeacherAnnouncements;
