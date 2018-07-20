import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {notify} from 'react-notify-toast';
import {ActionViewArray,FileFileDownload,NavigationFullscreen,NavigationClose} from '../../../styledcomponents/SvgIcons.js'
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import { Grid, Row, Col } from 'react-flexbox-grid';
import UnauthorizedPage from '../../UnauthorizedPage.js'
import Divider from 'material-ui/Divider'
import { withRouter } from 'react-router'
import {redA700} from 'material-ui/styles/colors'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'

var properties = require('../../properties.json');

class ListHandouts extends Component{

  constructor(){
    super();
    this.state={
      links: [],
      comments: [],
      buttonDisabled: false,
      isLoaded: false,
      loadHandouts: false,
      username: '',
      confirmDeleteDialog: false,
      currentIndex: 0,
    }
  }

  deleteHandoutsConfirm = (index) => {
    this.setState({
      confirmDeleteDialog : true,
      currentIndex: index
    })
  }

  renderCardHeader = (src) => {
    var buffer = []
    var date = new Date(parseInt(src.split('-').pop(),10))
      buffer.push(
      <CardHeader
        key={src}
        className="cardHeaderwithTopBorder"
        title="Uploaded By"
        avatar={this.state.profilePicUrl}
        subtitle={src.split('-')[7]+" on "+ date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}
        showExpandableButton={true}
        closeIcon={<NavigationClose color={redA700} viewBox="0 0 30 30" />}
        openIcon={<NavigationClose color={redA700} viewBox="0 0 30 30"/>}
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
              onExpandChange={this.deleteHandoutsConfirm.bind(this,index)}
              style={{borderRadius: '1.5em'}}
              >
               {this.renderCardHeader(src)}
                <CardMedia>
                    <iframe title="handouts" src={src} className="iframe">
                    Unable to display--your browser does not support frames.
                    </iframe>
                </CardMedia>
                <CardTitle style={{textAlign:'center'}} subtitle={this.state.comments[index]} />
                <CardActions>
                <Grid fluid>
                <Row center="xs">
                <Col xs>
                  <form method="post" action={src+"/download"}>
                  <FlatButton type="submit" label="Download" fullWidth={true} icon={<FileFileDownload color="#30b55b"/>}/>
                  </form>
                 </Col>
                <Col xs>
                  <form method="get" action={src}>
                  <FlatButton type="submit" label="View" fullWidth={true} icon={<NavigationFullscreen color="#30b55b" />}/>
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
    return(<p>No handouts were found for this class</p>)
  }
    return buffer
  }



 loadHandouts = () => {
     this.setState({ buttonDisabled: true });
     fetch('http://'+properties.getHostName+':8080/teacher/handoutslist', {
            method: 'POST',
            headers: {
                  'mode': 'cors',
                  'Content-Type': 'application/json'
              },
          credentials: 'include',
          body: JSON.stringify({
            batch: this.props.batch,
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
 handleClose = () => {
   this.setState({
     confirmDeleteDialog: false,
   })
 }
 deleteHandouts = () => {
   fetch(this.state.links[this.state.currentIndex]+'/delete',{
     credentials: 'include',
     method: 'GET'
   }).then(response => {
     if(response.status===200)
     {
      notify.show("Deleted successfully","success")
      this.loadHandouts()
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
        onTouchTap={this.deleteHandouts}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ]
if(this.props.userrole==="teacher"){
   return(
     <div className="ListHandouts">
     <p className="paragraph">Your handouts for the class {this.props.batch}</p>
     <Grid fluid className="nogutter">
     <Row around="xs">
     <Col xs={12} sm={12} md={10} lg={8}>
      <Divider />
    </Col>
    </Row>
    </Grid>
     <Grid fluid className="nogutter">
     <br />
     <Row center="xs">
     <FlatButton label="View Handouts" labelStyle={{textTransform: 'none'}}
       style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
       primary={true} icon={<ActionViewArray />} onClick={this.loadHandouts}/>
     </Row>
     <Row around="xs">
     {this.displayNotes()}
    </Row>
    </Grid>
    <Dialog
          title="Are you sure you want to delete this handout ?"
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
ListHandouts.contextTypes = {
    router: PropTypes.object
};

export default withRouter(ListHandouts);
