import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

var properties = require('../properties.json');

class StudentTeacherAnnouncements extends Component{

  constructor(){
    super();
    this.state={
      announcements: [],
      teachernames: [],
      announcementIds: [],
    }
  }

  list(buffer){

    if(this.state.announcements.length === 0)
    buffer.push(<p key={new Date()} className="messageStyle" style={{textAlign:"center"}}>You are all caught up, you don't have any announcements yet</p>)
    else{
    for (let i=0;i<this.state.announcements.length;i++){
        var date = new Date(parseInt(this.state.announcementIds[i].split('-')[6],10))
      buffer.push(
                    <Grid fluid key={i} className="nogutter">
                    <Row >
                    <Col xs={12} sm={12} md={12} lg={12}>
                    <li >
                    <p className="name"> <span className="fontStyle">{this.state.teachernames[i]}: </span>
                    <span className="messageStyle">{this.state.announcements[i]}</span>
                    <span className="dateStyle">{" "+date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()} </span>
                    </p>
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
            if(response.status === 200)
            return response.json()
            else if(response.status === 302){
               window.location.reload()
            }
          }).then(response => {
            var newmessage = []
            var newannouncementIds =[]
            var newTeacherNames = []
            for(let i=0;i<response.content.length;i++)
             { newmessage.push(response.content[i].message)
               newannouncementIds.push(response.content[i].announcementid)
               newTeacherNames.push(response.content[i].posteduser.firstName+response.content[i].posteduser.lastName)}
             this.setState({
                 announcementIds: newannouncementIds,
                 announcements: newmessage,
                 teachernames: newTeacherNames,
                 total: response.totalPages
           })
          })
  }

  componentDidMount(){
    this.populateData(1)
  }

  render(){
    var buffer = [];
    return(
      <div className="announcements">
      <h2 className="paragraph">Announcements from your teachers</h2>
      <div  className="container">
         <ul style={{color:  '#cccccc'}}>{this.list(buffer)}</ul>
       </div>
      </div>
    )
  }
}
StudentTeacherAnnouncements.contextTypes = {
    router: PropTypes.object
};

export default withRouter(StudentTeacherAnnouncements)
