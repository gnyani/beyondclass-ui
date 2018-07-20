import React,{Component} from 'react'
import styled from 'styled-components'
import UnauthorizedPage from '../UnauthorizedPage.js'
import {List, ListItem} from 'material-ui/List'
import {withRouter} from 'react-router-dom'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Delete from 'material-ui/svg-icons/action/delete'
import NotificationsNone from 'material-ui/svg-icons/social/notifications-none'
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import {grey400} from 'material-ui/styles/colors'
import PropTypes from 'prop-types'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import FlatButton from 'material-ui/FlatButton'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import {Media} from '../utils/Media'

var properties = require('../properties.json')

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`
const styles = {
  uploadButton: {
    verticalAlign: 'middle',
    border: "0.05em solid #30b55b",
    color: "#30b55b",
    borderRadius: '1vmax'
  }
}

class Notifications extends Component {

  constructor(props){
    super();
    this.state={
      notificationsCount: props.notificationsCount,
      notificationIds: [],
      notificationMessages: [],
      notificationPictureUrls: [],
      notificationType: [],
      createdDates: [],
      isDataLoaded: false,
    }
    this.handleNotificationRead = this.handleNotificationRead.bind(this)
  }


  componentDidMount(){
    this.getNotifications()
  }
  getNotifications(){
    fetch('http://'+properties.getHostName+':8080/user/notifications',{
            credentials: 'include',
            method: 'GET'
          }).then(response =>{
            if(response.status === 200)
              return response.json()
          }).then(response =>{
            var newnotificationIds = []
            var newnotificationMessages = []
            var newnotificationPictureUrls = []
            var newnotificationType = []
            var newcreatedDates = []
            for(let i=0;i<response.length;i++){
              newnotificationIds.push(response[i].notificationId)
              newnotificationMessages.push(response[i].content)
              newnotificationPictureUrls.push(response[i].picurl)
              newnotificationType.push(response[i].notificationType)
              newcreatedDates.push(response[i].createdAt)
            }
            this.setState({
              notificationIds: newnotificationIds,
              notificationMessages: newnotificationMessages,
              notificationPictureUrls: newnotificationPictureUrls,
              notificationType: newnotificationType,
              createdDates: newcreatedDates,
              isDataLoaded: true
            })
          }).catch(response => {
          notify.show("Please login before viewing notifications","error");
          this.context.router.history.push('/');
         });
  }
handleRoute(route,index){
  this.context.router.history.push('/'+route)
  this.handleNotificationRead(index)
}
handleNotificationDelete(index){
  fetch('http://'+properties.getHostName+':8080/user/notifications/delete',{
       method: 'POST',
       headers: {
           'mode': 'cors',
           'Content-Type': 'application/json'
         },
       credentials: 'include',
     body: this.state.notificationIds[index],

    }).then(response => {
      if(response.status === 200 )
      {
        notify.show("Deleted","success")
        this.componentDidMount()
      }
    }).catch(response => {
    notify.show("Please login before viewing dashboard","error");
    this.context.router.history.push('/');
   });
}
markAllAsRead = () => {
  fetch('http://'+properties.getHostName+':8080/user/notifications/markallasread',{
        credentials: 'include',
        method: 'GET'
      }).then(response =>{
          if(response.status === 200)
          {
            notify.show("Success","success")
          }
          else{
            notify.show("Sorry something went wrong please try again later","error")
          }
      }).then(response =>{
         window.location.reload()
      }).catch(response => {
      notify.show("Please login before viewing notifications","error");
      this.context.router.history.push('/');
     });
}

  handleNotificationRead(index){
    fetch('http://'+properties.getHostName+':8080/user/notifications/read',{
         method: 'POST',
         headers: {
             'mode': 'cors',
             'Content-Type': 'application/json'
           },
         credentials: 'include',
       body: this.state.notificationIds[index],

      }).then(response => {
        if(response.status === 200)
          this.componentDidMount()
      }).catch(response => {
      notify.show("Please login before viewing notifications","error");
      this.context.router.history.push('/');
     });
}
list(buffer){
  if(!this.state.isDataLoaded)
  buffer.push(
    <Grid fluid key={1} className="RefreshIndicator">
    <Row center="xs">
    <Col xs>
    <br /><br />
      <RefreshIndicator
         size={50}
         left={45}
         top={0}
         loadingColor="#FF9800"
         status="loading"
         className="refresh"
        />
    </Col>
    </Row>
    </Grid>)
  else if(this.state.notificationMessages.length === 0)
  buffer.push(<div key={1} ><NotificationsNone style={{marginLeft:"27%",height:'300px',width:'45%'}}/><p className="announcements"><span className="paragraph">You are all caught up </span></p></div>)
  else{
    buffer.push(
      <div key={1}>
      <Grid fluid>
      <Row center="xs">
      <FlatButton label="Mark All As Read" primary={true} style={styles.uploadButton} onClick={this.markAllAsRead}/>
      </Row>
      </Grid>
      <br /> <br />
       </div>)
  for(let index=0;index<this.state.notificationMessages.length;index++)
  {
    var date= new Date(this.state.createdDates[index])
  buffer.push(<div key={Date.now()+index}>
    <Grid fluid>
    <Row around="xs" middle="xs">
    <Col xs={11} sm={11} md={11} lg={11}>
    <ListItem
      leftAvatar={<Avatar src={this.state.notificationPictureUrls[index]} />}
      primaryText={this.state.notificationMessages[index]}
      onTouchTap={this.handleRoute.bind(this,this.state.notificationType[index],index)}
      secondaryText={<p>{date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}</p>}
    />
    <Divider inset={true}/>
    </Col>
    <Col xs={1} sm={1} md={1} lg={1}>
    <IconMenu iconButtonElement={
                  <IconButton
                    touch={true}
                    tooltip="more"
                    tooltipPosition="bottom-left"
                  >
                    <MoreVertIcon color={grey400} />
                  </IconButton>
                 }>
              <MenuItem onTouchTap={this.handleNotificationRead.bind(this,index)} leftIcon={<RemoveRedEye color="green"/>}>Mark as Read</MenuItem>
                <MenuItem onTouchTap={this.handleNotificationDelete.bind(this,index)} leftIcon={<Delete color="red"/>}>Delete</MenuItem>
                </IconMenu>
    </Col>
    </Row>
    </Grid>

  </div>
  )}
}
  return buffer;
}
  render(){
   var buffer = []
     if(this.props.userrole==="student")
    {
    return(
      <StayVisible
      {...this.props}
      >
      <Grid fluid>
      <Row around="xs">
      <Col xs={12} sm={12} md={10} lg={9}>
      <br /> <br />
    <div>
      <List>
       {this.list(buffer)}
      </List>
    </div>
    </Col>
    </Row>
    </Grid>
      </StayVisible>
    )
  }else{
    return(<UnauthorizedPage />)
  }
}
}
Notifications.contextTypes = {
    router: PropTypes.object
};
export default withRouter(Notifications);
