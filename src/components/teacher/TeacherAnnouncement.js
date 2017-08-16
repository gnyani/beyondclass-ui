import React,{Component} from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Pagination from 'material-ui-pagination';
import {notify} from 'react-notify-toast';
import IconButton from 'material-ui/IconButton';
import {NavigationClose} from '../../styledcomponents/SvgIcons.js';
import Dialog from 'material-ui/Dialog';
import {Grid,Row,Cell} from 'react-inline-grid';


var properties = require('../properties.json');
class TeacherAnnouncement extends Component{
  constructor(){
    super();
    this.state={
      total: 3,
      display: 7,
      number: 1,
      message: '',
      announcements: [],
      DeleteConfirm: false,
      currentIndex: '',
      announcementids: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.Enter = this.Enter.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.populateData = this.populateData.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.DeleteAnnouncement = this.DeleteAnnouncement.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }
  handleDialogOpen(i){
    this.setState({
      DeleteConfirm: true,
      currentIndex: i,
    })
  }

  handleSubmit(){
     this.setState({
       buttonDisabled: true
     })
     var trimmedmessage = this.state.message.replace(/\s/g,'')
     if(trimmedmessage===''){
      notify.show("Message cannot be null","error");
     }else{
    fetch('http://'+properties.getHostName+':8080/teacher/announcements/insert', {
           method: 'POST',
           headers: {
                 'mode': 'cors',
                 'Content-Type': 'application/json'
             },
         credentials: 'include',
         body: JSON.stringify({
           teacherclass: this.props.class,
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
         })
         this.componentWillMount()
         notify.show("Anouncement uploaded successfully","success")
       })}
  }

 list(buffer){
   for (let i=0;i<this.state.announcements.length;i++){
     buffer.push(
                   <Grid key={i}>
                   <Row is="start">
                   <Cell is="10 tablet-10 phone-10"><div>
                   <li >
                   <p className="name">{this.state.announcements[i]} </p>
                   </li>
                   </div></Cell>
                   <Cell is="middle 2 tabet-2 phone-2"><div>
                   <IconButton onClick = {this.handleDialogOpen.bind(this,i)}><NavigationClose color="red"/></IconButton>
                   </div></Cell>
                   </Row>
                   </Grid>

                )
 }
 return buffer;
}
  populateData(pageNumber){
    fetch('http://'+properties.getHostName+':8080/teacher/announcements/list/'+this.props.class+'?pageNumber='+pageNumber, {
             credentials: 'include',
             method: 'GET'
          }).then(response => {
            return response.json()
          }).then(response => {
            var newmessage = []
            var newannouncementIds =[]
            for(let i=0;i<response.content.length;i++)
             { newmessage.push(response.content[i].message)
               newannouncementIds.push(response.content[i].announcementid)}
             this.setState({
                 announcementIds: newannouncementIds,
                 announcements: newmessage,
                 total: response.totalPages
           })
          })
  }

  componentWillMount(){
    this.populateData(1)
  }

  DeleteAnnouncement(){
    fetch('http://'+properties.getHostName+':8080/teacher/announcement/delete/'+this.state.announcementIds[this.state.currentIndex],{
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

  handlePageChange(number){
   this.setState({
     number: number,
     users:[],
     messages:[],
     message : '',
   })
   this.populateData(number);
  }

  handleMessageChange = (e) => this.setState({message:e.target.value});

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
    return(
      <div className="announcements">
      <h2 className="heading"> Your Announcements for class {this.props.class}</h2>
      <div  className="container page">
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
        onChange = {this.handleMessageChange}
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
    )
  }
}

export default TeacherAnnouncement;
