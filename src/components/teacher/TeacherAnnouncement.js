import React,{Component} from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Pagination from 'material-ui-pagination';
import {notify} from 'react-notify-toast';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete'
import Dialog from 'material-ui/Dialog';
import {Grid,Row,Col} from 'react-flexbox-grid';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'


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
      buttonDisabled: false,
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
           batch: this.props.class,
           message: this.state.message,
        })
       }).then(response => {
         if(response.status === 200)
         {
            return response.text();
         }
         else if(response.status === 302){
                  window.location.reload()
        }
         else{
           let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
           notify.show("sorry something went wrong","custom",5000,myColor)
         }
       }).then(response => {
         this.setState({
           response : response,
           number : 1,
           buttonDisabled: false,
           message: '',
         })
         this.componentDidMount()
         notify.show("Anouncement uploaded successfully","success")
       })}
  }

 list(buffer){
   if(this.state.announcements.length !== 0)
   {
   for (let i=0;i<this.state.announcements.length;i++){
     var date = new Date(parseInt(this.state.announcementIds[i].split('-')[6],10))
     buffer.push(
                   <Grid fluid key={i} className="noGutter">
                   <Row middle="xs">
                   <Col xs={10} sm={10} md={10} lg={10}>
                   <li >
                   <p className="name"> <span className="fontStyle">{this.state.announcements[i]}</span>
                   <span className="dateStyleTeacher">{date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()} </span>
                   </p>
                   </li>
                   </Col>
                   <Col xs={1} sm={1} md={1} lg={1}>
                   <IconButton onClick = {this.handleDialogOpen.bind(this,i)}><Delete color='#bbbbbb' viewBox='0 0 20 20'/></IconButton>
                   </Col>
                   </Row>
                   </Grid>

                )
      }
 }
 else{
   buffer.push(<p className="name" key={new Date()}><span className="fontStyle">
                You did not make any announcements to this class yet !!!
               </span></p>)
 }
 return buffer;
}
  populateData(pageNumber){
    fetch('http://'+properties.getHostName+':8080/teacher/announcements/list/'+this.props.class+'?pageNumber='+pageNumber, {
             credentials: 'include',
             method: 'GET'
          }).then(response => {
           if(response.status === 200)
            return response.json()
            else if(response.status === 302){
              this.context.router.history.push('/')
            }
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

  componentDidMount(){
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
            this.componentDidMount()
          }
          else if(response.status === 302){
              this.context.router.history.push('/')
          }
          else{
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
      <Grid fluid>
      <Row around="xs">
      <Col xs={12} sm={12} md={10} lg={10}>
      <div className="announcements">
      <h2 className="heading"> Your Announcements for class {this.props.class}</h2>
      <div  className="container page">
         <ul style={{color:  '#cccccc'}}> {this.list(buffer)} </ul>
       </div>
       <br />
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
      </Col>
      </Row>
      </Grid>
    )
  }
}
TeacherAnnouncement.contextTypes = {
    router: PropTypes.object
};

export default withRouter(TeacherAnnouncement)
