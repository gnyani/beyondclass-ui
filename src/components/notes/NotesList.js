import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {notify} from 'react-notify-toast';
import {lightBlue300} from 'material-ui/styles/colors';
import {ActionViewArray,FileFileDownload,NavigationFullscreen} from '../../styledcomponents/SvgIcons.js'
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import { Grid, Row, Col } from 'react-flexbox-grid';
import UnauthorizedPage from '../UnauthorizedPage.js'

var properties = require('../properties.json');

class NotesList extends Component{

  constructor(){
    super();
    this.state={
      links: [],
      subject: 1,
      buttonDisabled: false,
      isLoaded: false,
      username: '',
      usermsg: '',
      loadedsubject: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
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
            links : response.slice(),
            buttonDisabled  : false,
            usermsg: '',
            isLoaded : true,
            loadedsubject : this.state.subject,
          })
          if(this.state.links.length===0)
          this.setState({
            usermsg : 'No files for this subject were found',
            isLoaded: true
          })
          notify.show("Files Retrieved successfully","success")
        })
   }

 }
 handleChange = (event, index, subject) => this.setState({subject});
  render(){
if(this.props.userrole==="student"){
   return(
     <Grid fluid>
     <Row around="xs">
     <Col xs={12} sm={12} md={10} lg={7}>
     <div>
     <br  /><br />
  <div className="QpSyllabusDefault">
     <Grid fluid>
     <Row around="xs" middle="xs">
     <Col xs={6} sm={6} md={6} lg={6}>
      <SelectField
        floatingLabelText="Subject*"
        value={this.state.subject}
        onChange={this.handleChange}
        style={{width:"100%"}}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'OS'} label="OS" primaryText="Operating Systems" />
        <MenuItem value={'DM'} label="DM" primaryText="Data Mining" />
      </SelectField>
      </Col>
      <Col xs={6} sm={6} md={6} lg={6} className="register">
      <FlatButton type="submit" label="View" disabled={this.state.buttonDisabled} icon={<ActionViewArray color="white"/>} className="nextButton" onClick={this.handleSubmit} />
      </Col>
      </Row>
      </Grid>
      </div>
     <div>
     <Grid fluid>
     <Row around="xs">
     {this.state.links.map((src, index) => (
     <Col xs={12} sm={12} md={9} lg={8} key={index}>
     <br />
           <Card style={{borderRadius:"2em"}}>
             <CardHeader
               title="Uploaded By"
               subtitle={src.split('-').pop()}
             />
             <CardMedia>
               <iframe  title="Notes" src={src} />
             </CardMedia>
             <CardTitle title={this.state.loadedsubject} subtitle="Notes" />
             <CardActions>
             <Grid fluid>
             <Row center="xs">
             <Col xs>
               <form method="post" action={src+"/download"}>
               <FlatButton type="submit" label="Download" fullWidth={true} icon={<FileFileDownload color={lightBlue300} />}/>
               </form>
              </Col>
             <Col xs>
               <form method="post" action={src}>
               <FlatButton type="submit" label="View" fullWidth={true} icon={<NavigationFullscreen color={lightBlue300} />}/>
               </form>
              </Col>
               </Row>
               </Grid>
             </CardActions>
           </Card>
          <br /> 
        </Col>
    ))}
    </Row>
    </Grid>
    <p style={{textAlign:"center"}}>
    {this.state.usermsg}
    </p>
    </div>
</div>
</Col>
</Row>
</Grid>
   )
 }else{
   return(<UnauthorizedPage />)
 }
}
}

export default NotesList;
