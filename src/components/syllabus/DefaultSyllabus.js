import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import {notify} from 'react-notify-toast';
import MenuItem from 'material-ui/MenuItem';
import {lightBlue300} from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardMedia} from 'material-ui/Card';
import {FileFileDownload,NavigationFullscreen} from '../../styledcomponents/SvgIcons.js';
import '../../styles/student-adda.css';
import { Grid, Row, Col } from 'react-flexbox-grid'
import SubjectAutoComplete from '../utils/SubjectAutoComplete.js'
import UnauthorizedPage from '../UnauthorizedPage.js'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

var properties = require('../properties.json');


class DefaultSyllabus extends Component{

   constructor(){
     super();
     this.state = {
       branch : 1,
       subject : 1,
       response : '',
       isLoaded : false,
       image: [],
       photoIndex: 0,
       isOpen: false
     }
     this.validateAndFetch = this.validateAndFetch.bind(this);
     this.fetchSyllabus = this.fetchSyllabus.bind(this);
     this.image = this.image.bind(this);
     this.handleSubjectChange = this.handleSubjectChange.bind(this)
   }

validateAndFetch(){
  if(this.state.value === 1)
  {
    notify.show("please select a subject");
  }
  else{
    this.fetchSyllabus();
  }
}

fetchSyllabus(){

  fetch('http://'+properties.getHostName+':8080/user/syllabusurl', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
      credentials: 'include',
       body: JSON.stringify({
         branch: this.state.branch,
         subject: this.state.subject
      })
     }).then(response => {
       if(response.status === 200)
       {
          return response.text();
       }else if(response.status === 302){
         this.context.router.history.push('/')
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
     }).then(response => {
       this.setState({
         response : response,
         isLoaded : true
       },function(){
         this.image()
       })
     })
}

handleSubjectChange(subjectValue){
  this.setState({
    subject: subjectValue
  })
}

image(){

  if(this.state.response){
    var x = []
    var obj = new Image();
      obj.src = this.state.response
      obj.onerror = () => {
        x.push(<p key={new Date()}>Sorry no records found for this subject</p>)
        this.setState({
          image: x.slice(),
        })
        notify.show("No Records found for this subject","warning")
      }

      obj.onload = () => {
        x.push(
          <Col xs={12} sm={12} md={11} lg={10} key={new Date()}>
            <Card
            style={{borderRadius:"1.5em"}}
            >
              <CardHeader
               className="cardHeaderwithTopBorder"
                title={this.state.subject}
                subtitle="Syllabus"
              />
              <CardMedia>
                 <img alt="loading" src ={obj.src} className="image" />
              </CardMedia>
              <CardActions>
                <div >
                <Grid fluid>
                <Row between="xs">
                <Col xs>
                <form method="post" action={obj.src+"/download"}>
                <FlatButton type="submit" label="Download" fullWidth={true} icon={<FileFileDownload color={lightBlue300} />}/>
                </form>
                </Col>
                <Col xs>
                <FlatButton type="submit" label="Full View" fullWidth={true}  onClick={() => this.setState({ isOpen: true })} icon={<NavigationFullscreen color={lightBlue300} />}/>
                </Col>
                </Row>
                </Grid>
                </div>
              </CardActions>
            </Card>
            </Col>
          )
        this.setState({
          image: x.slice(),
        })
        notify.show("Retrieval Successful","success");
      }
   }
}

handleChange = (event, index, branch) => this.setState({branch});

  render(){
  if(this.props.userrole==="student")
  {
    return(
      <Grid fluid>
      <Row around="xs">
      <Col xs={12} sm={12} md={10} lg={10}>
  <div>
    <div className="Syllabus">
       <div >
       <br />
      <Grid fluid>
      <Row around="xs" bottom="xs">
      <Col xs={12} sm={12} md={5} lg={5}>
       <SelectField
        floatingLabelText="Branch*"
         value={this.state.branch}
         onChange={this.handleChange}
         autoWidth={true}
       >
         <MenuItem value={1} primaryText="Select*" />
         <MenuItem value={'CSE'} label="CSE" primaryText="CSE" />
         <MenuItem value={'ECE'} label="ECE" primaryText="ECE" />
       </SelectField>
       </Col>
       <Col xs={12} sm={12} md={5} lg={5}>
       <SubjectAutoComplete branch={this.state.branch} handleSubjectChange={this.handleSubjectChange} />
       </Col>
       </Row>
       </Grid>
       <br />
       <Grid fluid>
       <Row around="xs" middle="xs">
       <Col  xs={12} sm={12} md={3} lg={3}>
       <FlatButton label="Fetch" value="Fetch" primary={true} className="fetchButton" onTouchTap={this.validateAndFetch} />
       </Col>
       </Row>
       </Grid>
       <br />
<Divider />
       </div>
        <br /> <br /> <br />
        <Grid fluid>
        <Row around="xs">
        {this.state.image}
        </Row>
        </Grid>
    </div>
    </div>
    </Col>
    </Row>
    </Grid>
    )
  }
  else{
    return(<UnauthorizedPage />)
  }
}
}
DefaultSyllabus.contextTypes = {
    router: PropTypes.object
};

export default withRouter(DefaultSyllabus)
