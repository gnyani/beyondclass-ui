import React, { Component } from 'react';
import {notify} from 'react-notify-toast';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import IconButton from 'material-ui/IconButton';
import {NavigationClose} from '../../styledcomponents/SvgIcons.js';
import Pagination from 'material-ui-pagination';
import Dialog from 'material-ui/Dialog';
import{Row,Grid,Col} from 'react-flexbox-grid';
import '../../styles/student-adda.css';
import UnauthorizedPage from '../UnauthorizedPage.js'
import {Media} from '../utils/Media'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
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
      DeleteConfirm: false,
      total: 3,
      display: 7,
      number: 1,
      currentIndex: 0,
      buttonDisabled: false
    }
    this.list = this.list.bind(this);
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
       if(response.status === 200)
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
       },function(){this.componentWillMount()})
       notify.show("Anouncement uploaded successfully","success")
     })}
}
handleDialogOpen(i){
  this.setState({
    DeleteConfirm: true,
    currentIndex: i,
  })
}

list(buffer){
  var i=0;
  for (i=0;i<this.state.users.length;i++){
  if(this.state.useremails[i] === this.props.loggedinuser)
  {
  buffer.push( <Grid fluid key={i}>
               <Row middle="xs">
               <Col xs={10} sm={10} md={11} lg={11}>
               <li >
                <p className="name"> <span className="fontStyle">{this.state.users[i]}: </span> <span className="messageStyle">{this.state.messages[i]}</span>
                </p></li>
                </Col>
               <Col xs={1} md={1} sm={1}lg={1}>
                <IconButton onClick = {this.handleDialogOpen.bind(this,i)}><NavigationClose color="red" hoverColor="black" viewBox='0 0 30 30'/></IconButton>
              </Col>
              </Row>
              </Grid>
             )
  }
else{
  buffer.push(<Grid fluid key={i}>
               <Row >
               <Col xs={12} sm={12} md={12} lg={12}>
               <li>
                <p className="name"> <span className="fontStyle">{this.state.users[i]}: </span> <span className="messageStyle">{this.state.messages[i]}</span> </p>
                </li>
                </Col>
                </Row>
                </Grid>
             )
}
}
  return buffer
}

populateData(pageNumber){
  fetch('http://'+properties.getHostName+':8080/user/announcements/list?pageNumber='+pageNumber, {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          return response.json()
        }).then(response => {
          var newmessage = []
          var newuser = []
          var newuseremails = []
          var newannouncementIds = []
          for(let i=0;i<response.content.length;i++)
           {
             newmessage.push(response.content[i].message)
             newuser.push(response.content[i].username)
             newuseremails.push(response.content[i].posteduser.email)
             newannouncementIds.push(response.content[i].aid)
          }
           this.setState({
               users: newuser,
               messages: newmessage,
               useremails: newuseremails,
               announcementIds : newannouncementIds,
               total: response.totalPages
         })
        })
}

componentWillMount(){
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
          this.componentWillMount()
        }else{
          notify.show("Sorry something went wrong", "error")
        }

      })
      this.handleClose()
}
render(){
var buffer=[];
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
<Grid fluid>
<Row start="xs">
<Col xs={12} sm={12} md={12} lg={12}>
<div className="announcements">
    <Grid fluid>
    <Row center="xs" middle="xs">
    <Col xs={2} sm={2} md={2} lg={1}>
    <img  className="image" src={require('../../styledcomponents/images/announcements.jpeg')} alt=""/>
    </Col>
    <Col xs={8} sm={8} md={8} lg={6}>
    <h2 className="heading"> Latest Announcements</h2>
    </Col>
    </Row>
    </Grid>
   <div  className="container">
      <ul> {this.list(buffer)} </ul>
    </div>
    <Pagination
    total = { this.state.total }
    current = { this.state.number }
    display = { this.state.display }
    onChange = { this.handlePageChange}
    />


    <TextField
     value = {this.state.message}
     onChange = {this.handleChange}
     hintText = "Give an anouncement"
     className="input"
     onKeyPress={this.Enter}
     />

    <FlatButton label="Announce" type="submit"  disabled={this.state.buttonDisabled}
     className="AnnounceButton" onTouchTap={this.handleSubmit}/>
     <Dialog
           title="Are you sure you want to Delte this anouncement"
           modal={false}
           actions={actions}
           open={this.state.DeleteConfirm}
           autoScrollBodyContent={true}
           titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
           onRequestClose={this.handleClose}
         >
     </Dialog>
</div>
</Col>
</Row>
</Grid>
</StayVisible>
);
}
else{
  return(<UnauthorizedPage />)
}
}
}

export default AnouncementsBoard;
