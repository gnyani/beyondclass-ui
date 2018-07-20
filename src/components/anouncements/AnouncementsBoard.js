import React, { Component } from 'react';
import {notify} from 'react-notify-toast';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import IconButton from 'material-ui/IconButton';
import Pagination from 'material-ui-pagination';
import Dialog from 'material-ui/Dialog';
import{Row,Grid,Col} from 'react-flexbox-grid';
import {ChatOutline} from '../../styledcomponents/SvgIcons.js'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import '../../styles/student-adda.css';
import UnauthorizedPage from '../UnauthorizedPage.js'
import {Media} from '../utils/Media'
import { withRouter } from 'react-router'
import Avatar from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import {DeleteOutline} from '../../styledcomponents/SvgIcons'
import RefreshIndicator from 'material-ui/RefreshIndicator'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : ''};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

class AnouncementsBoard extends Component{

  constructor() {
    super();
    this.state={
      users : [],
      messages : [],
      message: '',
      response:'',
      useremails: [],
      announcementIds: [],
      profilePictures: [],
      DeleteConfirm: false,
      total: 3,
      display: 7,
      number: 1,
      currentIndex: 0,
      buttonDisabled: false,
      isDataLoaded: false,
    }
    this.handleClose = this.handleClose.bind(this)
    this.populateData = this.populateData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.DeleteAnnouncement = this.DeleteAnnouncement.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this);
    this.Enter = this.Enter.bind(this);
}

handleSubmit(){
   this.setState({
     buttonDisabled: true
   })
   var trimmedmessage = this.state.message.replace(/\s/g,'')
   if(trimmedmessage===''){
    notify.show("Message cannot be null","error");
   }else{
  fetch('http://'+properties.getHostName+':8080/user/announcements/insert', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         message: this.state.message,
      })
     }).then(response => {
       if(response.status === 201 )
       {
          return response.text();
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
     }).then(response => {
       this.setState({
         response : response,
         number : 1,
         message: '',
       },function(){this.componentDidMount()})
       notify.show("Announcement posted successfully","success")
     }).catch(response => {
     notify.show("Please login before posting an announcement","error");
     this.context.router.history.push('/');
    });
   }
}
handleDialogOpen(i){
  this.setState({
    DeleteConfirm: true,
    currentIndex: i,
  })
}

listItems = () =>{
  var buffer = []
  if(this.state.isDataLoaded)
    {
    if(this.state.users.length === 0){
      buffer.push(<h4>You don't have any announcements yet !!! </h4>)
    }else{
      for (var i=0;i<this.state.users.length;i++){
        var date = new Date(parseInt(this.state.announcementIds[i].split('-')[7],10))
      if(this.state.useremails[i] === this.props.loggedinuser)
      {
      buffer.push( <Grid fluid key={i}  className="nogutter">
                   <Row around="xs">
                   <Col xs>
                     <ListItem
                      className="listPrimaryText"
                      disabled={true}
                      primaryText={this.state.users[i]}
                      leftAvatar={<Avatar src={this.state.profilePictures[i]} />}
                      rightIconButton={
                        <IconButton
                        touch={true}
                        onClick = {this.handleDialogOpen.bind(this,i)}
                        >
                        <DeleteOutline color='red' />
                        </IconButton>}
                      secondaryText={<p style={{fontWeight: 'lighter'}}>
                        <span style={{color: "black"}}>{this.state.messages[i]}</span><br />
                        Posted On {date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}
                      </p>}
                      secondaryTextLines={2}
                      />
                    <Divider inset={true} />
                    </Col>
                  </Row>
                  </Grid>
                 )
      }
    else{
      buffer.push(<Grid fluid key={i} className="nogutter">
                   <Row around="xs">
                   <Col xs>
                     <ListItem
                      className="listPrimaryText"
                      leftAvatar={<Avatar src={this.state.profilePictures[i]} />}
                      disabled={true}
                      primaryText={this.state.users[i]}
                      secondaryText={<p style={{fontWeight: 'lighter'}}>
                        <span style={{color: "black"}}>{this.state.messages[i]}</span><br />
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
    }
  }else{
    buffer.push(<Grid fluid className="RefreshIndicator" key={1}>
    <Row center="xs">
    <Col xs>
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
  }
  return buffer;
}

populateData(pageNumber){
  fetch('http://'+properties.getHostName+':8080/user/announcements/list?pageNumber='+pageNumber, {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          if(response.status === 200 )
          return response.json()
          else{
            notify.show("something went wrong","error")
          }
        }).then(response => {
          var newmessage = []
          var newuser = []
          var newuseremails = []
          var newannouncementIds = []
          var newProfilePictures = []
          for(let i=0;i<response.content.length;i++)
           {
             newmessage.push(response.content[i].message)
             newuser.push(response.content[i].username)
             newuseremails.push(response.content[i].posteduser.email)
             newannouncementIds.push(response.content[i].announcementid)
             newProfilePictures.push(response.content[i].posteduser.normalpicUrl || response.content[i].posteduser.googlepicUrl)
          }
           this.setState({
               users: newuser,
               messages: newmessage,
               useremails: newuseremails,
               announcementIds : newannouncementIds,
               profilePictures: newProfilePictures,
               total: response.totalPages,
               isDataLoaded: true,
         })
       }).catch(response => {
        notify.show("Please login before viewing announcements","error");
        this.context.router.history.push('/');
       });
}

componentDidMount(){
  this.populateData(1)
}

handlePageChange(number){
 this.setState({
   number: number,
   users:[],
   messages:[],
   message : '',
 })
 this.populateData(number);
}

handleChange = (e) => this.setState({message:e.target.value});

Enter(event){
  if(event.key === 'Enter'){
    this.handleSubmit();
  }
}
handleClose(){
  this.setState({
    DeleteConfirm: false,
  })
}
DeleteAnnouncement(){
  fetch('http://'+properties.getHostName+':8080/user/announcement/delete/'+this.state.announcementIds[this.state.currentIndex],{
        credentials: 'include',
        method: 'GET'
      }).then(response =>{
        if(response.status === 200)
        return response.text()
      }).then(response =>{
        if(response === "Success")
        {
          notify.show("Announcement Deleted successfully","success")
          this.componentDidMount()
        }
        else{
          notify.show("Sorry something went wrong", "error")
        }
      }).catch(response => {
      notify.show("Please login before you delete an announcement","error");
      this.context.router.history.push('/');
     });
      this.handleClose()
}
render(){
const actions = [
  <FlatButton
    label="Confirm"
    primary={true}
    onTouchTap={this.DeleteAnnouncement}
  />,
  <FlatButton
    label="Cancel"
    primary={true}
    onTouchTap={this.handleClose}
  />]
if(this.props.userrole==="student")
{
return(

<StayVisible
  {...this.props}
>
<div className="announcements">
    <Grid fluid>
    <Row  center="xs" middle="xs">
    <Col  xs={2} sm={2} md={2} lg={1}>
      <ChatOutline style={{height:'3em', width: '3em', marginTop: '0.5em', marginLeft: '1em', color:'#30b55b'}}/>
    </Col>
    <Col xs={8} sm={8} md={8} lg={5}>
    <h2 className="heading">Announcement Board</h2>
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
    <br />
    <p className="note">Note: All your announcements will be expired after 7 days</p>
    <Pagination
    total = { this.state.total }
    current = { this.state.number }
    display = { this.state.display }
    onChange = { this.handlePageChange}
    />


    <TextField
     value = {this.state.message}
     onChange = {this.handleChange}
     hintText = "Give an announcement"
     className="input"
     onKeyPress={this.Enter}
     />

   <FlatButton label="Announce" type="submit"  labelStyle={{textTransform: "none", fontSize: '1em'}} disabled={this.state.buttonDisabled}
     className="AnnounceButton" onTouchTap={this.handleSubmit} />
     <Dialog
           title="Are you sure you want to Delete this anouncement"
           modal={false}
           actions={actions}
           open={this.state.DeleteConfirm}
           autoScrollBodyContent={true}
           titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
           onRequestClose={this.handleClose}
         >
     </Dialog>
     <br /><br />
</div>
</StayVisible>
);
}
else{
  return(<UnauthorizedPage />)
}
}
}
AnouncementsBoard.contextTypes = {
    router: PropTypes.object
};

export default withRouter(AnouncementsBoard);
