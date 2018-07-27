import React,{Component} from 'react'
import {notify} from 'react-notify-toast'
import {Grid,Row,Col} from 'react-flexbox-grid'
import { withRouter } from 'react-router'
import {ChatOutline} from '../../styledcomponents/SvgIcons.js'
import {List, ListItem} from 'material-ui/List'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'

var properties = require('../properties.json');

class StudentTeacherAnnouncements extends Component{

  constructor(){
    super();
    this.state={
      announcements: [],
      teachernames: [],
      announcementIds: [],
      profilePictures: [],
    }
  }

  listItems = () => {
 var buffer = []
    if(this.state.announcements.length === 0)
    buffer.push(<p key={1} className="heading">You are all caught up, you don't have any announcements yet</p>)
    else{
    for (let i=0;i<this.state.announcements.length;i++){
        var date = new Date(parseInt(this.state.announcementIds[i].split('-')[6],10))
      buffer.push(
                    <Grid fluid key={i} className="nogutter">
                    <Row >
                    <Col xs>
                      <ListItem
                       className="listPrimaryText"
                       leftAvatar={<Avatar src={this.state.profilePictures[i]} />}
                       disabled={true}
                       primaryText={this.state.teachernames[i]}
                       secondaryText={<p style={{fontWeight: 'lighter'}}>
                         <span style={{color: "black"}}>{this.state.announcements[i]}</span><br />
                         Posted on {date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}
                       </p>}
                       secondaryTextLines={2}
                       />
                     <Divider inset={true} />
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
          }).then(response => {
            var newmessage = []
            var newannouncementIds =[]
            var newTeacherNames = []
            var newProfilePictures = []
            for(let i=0;i<response.content.length;i++)
             { newmessage.push(response.content[i].message)
               newannouncementIds.push(response.content[i].announcementid)
               newTeacherNames.push(response.content[i].posteduser.firstName+response.content[i].posteduser.lastName)
               newProfilePictures.push(response.content[i].posteduser.normalpicUrl   || response.content[i].posteduser.googlepicUrl )
             }
             this.setState({
                 announcementIds: newannouncementIds,
                 announcements: newmessage,
                 teachernames: newTeacherNames,
                 profilePictures: newProfilePictures,
                 total: response.totalPages
           })
          }).catch(response => {
          notify.show("Please login your session expired","error");
          this.context.router.history.push('/');
         });
  }

  componentDidMount(){
    this.populateData(1)
  }

  render(){
    return(
      <div className="announcements">
        <Grid fluid>
        <Row  center="xs" middle="xs">
        <Col  xs={2} sm={2} md={2} lg={1}>
          <ChatOutline style={{height:'2.5em', width: '2.5em', marginTop: '0.5em', marginLeft: '1em', color:'#30b55b'}}/>
        </Col>
        <Col xs={8} sm={8} md={8} lg={7}>
        <h2 className="heading">Announcements from your teachers</h2>
        </Col>
        </Row>
        </Grid>
        <Grid fluid className="nogutter">
        <Row center="xs" >
        <Col xs={12} sm={12} md={10} lg={8}>
        <List>
              {this.listItems()}
        </List>
        </Col>
        </Row>
        </Grid>

      </div>
    )
  }
}
StudentTeacherAnnouncements.contextTypes = {
    router: PropTypes.object
};

export default withRouter(StudentTeacherAnnouncements)
