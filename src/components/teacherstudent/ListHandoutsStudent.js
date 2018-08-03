import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {notify} from 'react-notify-toast';
import {ActionViewArray,FileFileDownload,NavigationFullscreen} from '../../styledcomponents/SvgIcons.js'
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import { Grid, Row, Col } from 'react-flexbox-grid';
import UnauthorizedPage from '../UnauthorizedPage.js'
import Divider from 'material-ui/Divider'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import SubjectAutoComplete from '../utils/SubjectAutoComplete.js'

var properties = require('../properties.json');

class ListHandoutsStudent extends Component{

  constructor(){
    super();
    this.state={
      links: [],
      comments: [],
      buttonDisabled: false,
      isLoaded: false,
      loadHandouts: false,
      subject: 1,
      username: '',
      confirmDeleteDialog: false,
      currentIndex: 0,
    }
  }


  handleSubjectChange = (subjectValue) => {
    this.setState({
      subject: subjectValue
    })
  }
  renderCardHeader = (src) => {
    var buffer = []
    var date = new Date(parseInt(src.split('-').pop(),10))
      buffer.push(
      <CardHeader
        key={src}
        className="cardHeaderwithTopBorder"
        title={src.split('-')[7]}
        avatar={this.state.profilePicUrl}
        subtitle={ date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}
      />
    )
    return buffer
  }

  displayNotes = () => {
    var buffer = []
    if(this.state.links.length > 0){
    for(var index=0; index < this.state.links.length ; index++){
      var src = this.state.links[index]
      buffer.push(
        <Col xs={12} sm={12} md={9} lg={8} key={index}>
        <br />
              <Card
              style={{borderRadius: '1.5em'}}
              >
               {this.renderCardHeader(src)}
                <CardMedia>
                    <iframe title="handouts" src={src} className="iframe">
                    Unable to display--your browser does not support frames.
                    </iframe>
                </CardMedia>
                <CardTitle style={{textAlign:'center'}} title={this.state.subject} subtitle={this.state.comments[index]} />
                <CardActions>
                <Grid fluid>
                <Row center="xs">
                <Col xs>
                  <form method="post" action={src+"/download"}>
                  <FlatButton type="submit" label="Download" fullWidth={true} icon={<FileFileDownload color='#30b55b' />}/>
                  </form>
                 </Col>
                <Col xs>
                  <form method="get" action={src}>
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
  }else if(this.state.links.length === 0 && this.state.loadHandouts === true){
    return(<p className="fontreq">No handouts were found for selected class</p>)
  }
    return buffer
  }



 loadHandouts = () => {
     this.setState({ buttonDisabled: true });
     fetch('http://'+properties.getHostName+':8080/student/handoutslist', {
            method: 'POST',
            headers: {
                  'mode': 'cors',
                  'Content-Type': 'application/json'
              },
          credentials: 'include',
          body: JSON.stringify({
            batch: this.props.class,
            subject: this.state.subject,
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
              isLoaded: true
            })
          }
        }).then(response => {
          this.setState({
            links : response.links.slice(),
            comments: response.comments.slice(),
            buttonDisabled  : false,
            isLoaded : true,
            profilePicUrl: response.profilePicUrl,
            loadHandouts: true,
          })
          if(this.state.links.length===0)
          this.setState({
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
  render(){
if(this.props.userrole==="student"){
   return(
     <div className="ListHandouts">
     {/* <p className="paragraph">View your handouts</p> */}
     <Grid fluid className="nogutter">
     <Row className="headfont" center="xs" middle="xs">
        <Col className="icn" xs={2} sm={2} md={2} lg={1}>
          <ActionViewArray style={{height:'2.5em', width: '2.5em', marginTop: '0.5em', marginLeft: '1em', color:'#30b55b'}}/>
        </Col>
        <Col xs={8} sm={8} md={8} lg={4}>
        <h2 className="customhead">View your handouts</h2>
        </Col>
      </Row>
     <Row className="listhand" center="xs" middle="xs">
     <Col xs={12} sm={12} md={9} lg={9}>
     <SubjectAutoComplete branch={this.props.branch} handleSubjectChange={this.handleSubjectChange} />
     <br />
     <br />
      </Col>
      <Col xs={6} sm={6} md={3} lg={3} className="NotesList">
      <FlatButton type="submit" label="View" labelStyle={{textTransform: "none", fontSize: '1em'}}
        disabled={this.state.buttonDisabled} className="nextButton" onClick={this.loadHandouts} />
        {/* icon={<ActionViewArray color="white"/>} */}
      <br />
      </Col>
      </Row>
     {/* <Row around="xs">
     <Col xs={12} sm={12} md={10} lg={8}>
      <Divider />
    </Col>
    </Row> */}
    </Grid>
     <Grid fluid className="nogutter">
     <br />
     <Row around="xs">
     {this.displayNotes()}
    </Row>
    </Grid>
</div>
   )
 }else{
   return(<UnauthorizedPage />)
 }
}
}
ListHandoutsStudent.contextTypes = {
    router: PropTypes.object
};

export default withRouter(ListHandoutsStudent);
