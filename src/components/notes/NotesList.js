import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {notify} from 'react-notify-toast';
import {ActionViewArray,FileFileDownload,NavigationFullscreen,NavigationClose} from '../../styledcomponents/SvgIcons.js'
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import { Grid, Row, Col } from 'react-flexbox-grid';
import UnauthorizedPage from '../UnauthorizedPage.js'
import Divider from 'material-ui/Divider'
import { withRouter } from 'react-router'
import {redA700} from 'material-ui/styles/colors'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import SubjectAutoComplete from '../utils/SubjectAutoComplete.js'

var properties = require('../properties.json');

class NotesList extends Component{

  constructor(){
    super();
    this.state={
      links: [],
      comments: [],
      subject: 1,
      buttonDisabled: false,
      isLoaded: false,
      username: '',
      usermsg: '',
      loadedsubject: '',
      confirmDeleteDialog: false,
      currentIndex: 0,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
  }

  handleSubjectChange(subjectValue){
    this.setState({
      subject: subjectValue
    })
  }
  deleteNotesConfirm = (index) => {
    this.setState({
      confirmDeleteDialog : true,
      currentIndex: index
    })
  }

  renderCardHeader = (src) => {
    var buffer = []
    var date = new Date(parseInt(src.split('-').pop(),10))
    if(this.props.loggedinuser === src.split('-')[7])
    {
      buffer.push(
      <CardHeader
        className="cardHeaderwithTopBorder"
        title="Uploaded By"
        avatar={this.state.profilePicUrl}
        subtitle={src.split('-')[7]+" on "+ date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}
        showExpandableButton={true}
        closeIcon={<NavigationClose color={redA700} viewBox="0 0 30 30" />}
        openIcon={<NavigationClose color={redA700} viewBox="0 0 30 30"/>}
      />
    )
  }else{
      buffer.push(
        <CardHeader
          className="cardHeaderwithTopBorder"
          title="Uploaded By"
          avatar={this.state.profilePicUrl}
          subtitle={src.split('-')[7]+" on "+ date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}
        />
      )
    }
    return buffer
  }

  displayNotes = () => {
    var buffer = []
    for(var index=0; index < this.state.links.length ; index++){
      var src = this.state.links[index]
      buffer.push(
        <Col xs={12} sm={12} md={9} lg={8} key={index}>
        <br />
              <Card
              onExpandChange={this.deleteNotesConfirm.bind(this,index)}
              style={{borderRadius: '1.5em'}}
              >
               {this.renderCardHeader(src)}
                <CardMedia>
                  <iframe  title="Notes" src={src} />
                </CardMedia>
                <CardTitle style={{textAlign:'center'}} title={this.state.loadedsubject} subtitle={this.state.comments[index]} />
                <CardActions>
                <Grid fluid>
                <Row center="xs">
                <Col xs>
                  <form method="post" action={src+"/download"}>
                  <FlatButton type="submit" label="Download" fullWidth={true} icon={<FileFileDownload color='#30b55b' />}/>
                  </form>
                 </Col>
                <Col xs>
                  <form method="post" action={src}>
                  <FlatButton type="submit" label="View" fullWidth={true} icon={<NavigationFullscreen color='#30b55b' />}/>
                  </form>
                 </Col>
                  </Row>
                  </Grid>
                </CardActions>
              </Card>
             <br />
           </Col>
      )
    }
    return buffer
  }

 handleSubmit(){

   if(this.state.subject === 1)
   {
   notify.show("please select a subject")
   }
   else{
     this.setState({ buttonDisabled: true });
     fetch('http://'+properties.getHostName+':8080/user/noteslist', {
            method: 'POST',
            headers: {
                  'mode': 'cors',
                  'Content-Type': 'application/json'
              },
          credentials: 'include',
          body: JSON.stringify({
            subject: this.state.subject
         })
        }).then(response => {
          if(response.status === 200)
          {
             return response.json();
          }
          else{
            let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
            notify.show("sorry something went wrong","custom",5000,myColor)
            this.setState({
              usermsg : 'sorry something went wrong',
              isLoaded: true
            })
          }
        }).then(response => {
          this.setState({
            links : response.links.slice(),
            comments: response.comments.slice(),
            buttonDisabled  : false,
            usermsg: '',
            isLoaded : true,
            profilePicUrl: response.profilePicUrl,
            loadedsubject : this.state.subject,
          })
          if(this.state.links.length===0)
          this.setState({
            usermsg : 'No files for this subject were found',
            isLoaded: true
          })
          else {
            notify.show("Files Retrieved successfully","success")
          }
        }).catch(response => {
        notify.show("Please login before viewing notes","error");
        this.context.router.history.push('/');
       });
   }
 }
 handleClose = () => {
   this.setState({
     confirmDeleteDialog: false,
   })
 }
 deleteNotes = () => {
   fetch(this.state.links[this.state.currentIndex]+'/delete',{
     credentials: 'include',
     method: 'GET'
   }).then(response => {
     if(response.status===200)
     {
      notify.show("Deleted successfully","success")
      this.handleSubmit()
    }
     else{
       notify.show("sorry something went wrong please try again","error")
     }
   }).catch(response => {
   notify.show("Please login before deleting notes","error");
   this.context.router.history.push('/');
  });
    this.setState({
      confirmDeleteDialog: false
    })
 }
  render(){
    const actions = [
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={this.deleteNotes}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ]
if(this.props.userrole==="student"){
   return(
     <div>
     <br  /><br />
     <div >
     <Grid fluid className="nogutter">
     <Row center="xs" middle="xs">
     <Col xs={12} sm={12} md={5} lg={3}>
     <SubjectAutoComplete branch={this.props.branch} handleSubjectChange={this.handleSubjectChange} />
     <br />
     <br />
      </Col>
      <Col xs={6} sm={6} md={4} lg={2} className="NotesList">
      <FlatButton type="submit" label="View" disabled={this.state.buttonDisabled} icon={<ActionViewArray color="white"/>} className="nextButton" onClick={this.handleSubmit} />
      <br />
      </Col>
      </Row>
      </Grid>
      <br />
      <Grid fluid className="nogutter">
      <Row around="xs" middle="xs">
      <Col xs={10} sm={10} md={10} lg={8}>
      <Divider />
      </Col>
      </Row>
      </Grid>
      </div>
     <div>
     <Grid fluid className="nogutter">
     <Row around="xs">
     {this.displayNotes()}
    </Row>
    </Grid>
    <p style={{textAlign:"center"}}>
    {this.state.usermsg}
    </p>
    </div>
    <Dialog
          title="Are you sure you want to delete this notes ?"
          modal={false}
          actions={actions}
          open={this.state.confirmDeleteDialog}
          autoScrollBodyContent={true}
          titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
          onRequestClose={this.handleClose}
        >
    </Dialog>
</div>
   )
 }else{
   return(<UnauthorizedPage />)
 }
}
}
NotesList.contextTypes = {
    router: PropTypes.object
};

export default withRouter(NotesList);
