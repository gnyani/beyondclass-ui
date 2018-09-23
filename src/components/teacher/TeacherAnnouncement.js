import React,{Component} from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Pagination from 'material-ui-pagination';
import {notify} from 'react-notify-toast';
import IconButton from 'material-ui/IconButton';
import {DeleteOutline} from '../../styledcomponents/SvgIcons'
import {ChatOutline} from '../../styledcomponents/SvgIcons.js'
import Dialog from 'material-ui/Dialog'
import {List, ListItem} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
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
      profilePictures: [],
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
       }).catch(response => {
       notify.show("Please login your session expired","error");
       this.context.router.history.push('/');
      });
     }
  }

 list = () => {
   var buffer=[]
   if(this.state.announcements.length !== 0)
   {
     buffer.push(<h2 className="paragraph uprcase" style={{fontSize:'20px'}} key={5}> Your announcements for class {this.props.class}</h2>)
   for (let i=0;i<this.state.announcements.length;i++){
     var date = new Date(parseInt(this.state.announcementIds[i].split('-')[6],10))
     buffer.push(
                   <Grid fluid key={i} className="nogutter">
                   <Row middle="xs">
                   <Col xs>
                     <ListItem
                      className="listPrimaryText"
                      leftAvatar={<Avatar src={this.state.profilePictures[i]} />}
                      disabled={true}
                      primaryText={this.state.announcements[i]}
                      rightIconButton={
                        <IconButton
                        onClick = {this.handleDialogOpen.bind(this,i)}>
                        <DeleteOutline color='red' />
                        </IconButton>
                      }
                      secondaryText={<p style={{fontWeight: 'lighter'}}>
                        Posted on {date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}
                      </p>}
                      secondaryTextLines={2}
                      />
                   </Col>
                   </Row>
                   </Grid>

                )
      }
 }
 else{
  buffer.push(<p className="fontreq" key={1}>You did not make any announcements to this class yet !!!</p>)
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
            var newProfilePictures = []
            for(let i=0;i<response.content.length;i++)
             { newmessage.push(response.content[i].message)
               newannouncementIds.push(response.content[i].announcementid)
               newProfilePictures.push(response.content[i].posteduser.normalpicUrl || response.content[i].posteduser.googlepicUrl)
             }
             this.setState({
                 announcementIds: newannouncementIds,
                 announcements: newmessage,
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

        }).catch(response => {
        notify.show("Please login your session expired","error");
        this.context.router.history.push('/');
       });
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
        <br />
      <Grid fluid>
        <Row  center="xs" middle="xs">
        <Col  xs={2} sm={2} md={2} lg={1}>
          <ChatOutline style={{height:'2.5em', width: '2.5em', marginTop: '0.5em', marginLeft: '1em', color:'#30b55b'}}/>
        </Col>
        <Col xs={8} sm={8} md={8} lg={5}>
          <h2 className="heading">ANNOUNCEMENT BOARD</h2>
        </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <TextField
             value = {this.state.message}
             onChange = {this.handleMessageChange}
             hintText = "Give an anouncement"
             className="input"
             onKeyPress={this.Enter}
             />
         </Col>
         <Col xs={2} sm={2} md={2} lg={2}>
            <FlatButton label="Announce" type="submit"  disabled={this.state.buttonDisabled}
              labelStyle = {{textTransform: 'none', fontSize: '1em'}}
             className="AnnounceButton" onTouchTap={this.handleSubmit}/>
           </Col>
        </Row>
      </Grid>
      <Grid fluid className="nogutter">
      <Row center="xs">
      <Col xs={12} sm={12} md={8} lg={8}>
      <List>
              {this.list()}
      </List>
      </Col>
      </Row>
      </Grid>
       <br />
      <Pagination
          total = { this.state.total }
          current = { this.state.number }
          display = { this.state.display }
          onChange = { this.handlePageChange}
          />
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
TeacherAnnouncement.contextTypes = {
    router: PropTypes.object
};

export default withRouter(TeacherAnnouncement)
