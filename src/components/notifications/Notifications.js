import React,{Component} from 'react'
import styled from 'styled-components';
import UnauthorizedPage from '../UnauthorizedPage.js'
import {List, ListItem} from 'material-ui/List';
import {withRouter} from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Delete from 'material-ui/svg-icons/action/delete';
import {NotificationsNone} from '../../styledcomponents/SvgIcons.js'
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400} from 'material-ui/styles/colors';
import PropTypes from 'prop-types';
import {Grid,Row,Cell} from 'react-inline-grid';
import {notify} from 'react-notify-toast';
import CircularProgress from 'material-ui/CircularProgress'

var properties = require('../properties.json')

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

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
    }
    this.handleNotificationRead = this.handleNotificationRead.bind(this)
  }


  componentWillMount(){
    this.getNotifications()
  }
  getNotifications(){
    fetch('http://'+properties.getHostName+':8080/user/notifications',{
            credentials: 'include',
            method: 'GET'
          }).then(response =>{
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
              createdDates: newcreatedDates
            })
          })
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
        notify.show("Deleted","success")
        this.componentWillMount()
    })
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
          this.componentWillMount()
      })
}
list(buffer){
  if(this.state.notificationMessages.length === 0)
  buffer.push(<div key={1}><NotificationsNone style={{marginLeft:"27%",height:'300px',width:'45%'}}/><p className="announcements messageStyle">You are all caught up </p></div>)
  else{
  for(let index=0;index<this.state.notificationMessages.length;index++)
  {
  buffer.push(<div key={index}>
    <Grid>
    <Row is="center">
    <Cell is="5 tablet-5 phone-5"><div>
    <ListItem
      leftAvatar={<Avatar src={this.state.notificationPictureUrls[index]} />}
      primaryText={this.state.notificationMessages[index]}
      onTouchTap={this.handleRoute.bind(this,this.state.notificationType[index],index)}
      secondaryText={<p>On {new Date(this.state.createdDates[index]).toDateString()} at {new Date(this.state.createdDates[index]).getUTCHours()}hrs</p>}
    />
    <Divider inset={true}/>
    </div></Cell>
    <Cell is="bottom 1 phone-1 tablet-1"><div>
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
    </div></Cell>
    </Row>
    </Grid>

  </div>
  )}
}
  return buffer;
}
  render(){
   var buffer = []
   if(this.state.notificationMessages[0] === undefined)
   {
   return(<CircularProgress size={80} thickness={7} style={{marginLeft:"48%"}}/> )
   }
    else if(this.props.userrole==="student")
    {
    return(
      <StayVisible
      {...this.props}
      >
      <br /> <br />
    <div>
      <List>
       {this.list(buffer)}
      </List>
    </div>
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
