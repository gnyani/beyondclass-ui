import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import {notify} from 'react-notify-toast';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardActions, CardHeader, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {FileFileDownload,NavigationFullscreen} from '../../styledcomponents/SvgIcons.js';
import '../../styles/student-adda.css';
import { Grid, Row, Col } from 'react-flexbox-grid';
import UnauthorizedPage from '../UnauthorizedPage.js'
import SubjectAutoComplete from '../utils/SubjectAutoComplete.js'
var properties = require('../properties.json');


class DefaultQp extends Component{

   constructor(){
     super();
     this.state = {
       branch : 'CSE',
       year : 1,
       subject : 1,
       response : '',
       image: [],
       isLoaded : false,
       photoIndex: 0,
       isOpen: false
     }
     this.validateAndFetch = this.validateAndFetch.bind(this);
     this.fetchQp = this.fetchQp.bind(this);
     this.handleSubjectChange = this.handleSubjectChange.bind(this)
   }

validateAndFetch(){
  if(this.state.branch === 1 || this.state.year === 1 || this.state.subject === 1)
  {
    notify.show("please select branch,year and subject","warning");
  }
  else{
    this.fetchQp();
  }
}

fetchQp(){

  fetch('http://'+properties.getHostName+':8080/user/questionpaperurl', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
      credentials: 'include',
       body: JSON.stringify({
         branch : this.state.branch,
         subject: this.state.subject,
         qpyear : this.state.year,
      })
     }).then(response => {
       if(response.status === 200)
       {
         notify.show("Retrieval successful","success");
        return response.text();
       }else if(response.status === 404){
         notify.show("No records found for this year","error")
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
     }).then(response => {
       this.setState({
         response : response,
         isLoaded : true
       })
     }).catch(response => {
     notify.show("Please login your session expired","error");
     this.context.router.history.push('/');
    });
}

handleChange = (event, index, branch) => this.setState({branch});
handleYearChange = (event, index, year) => this.setState({year});

handleSubjectChange(subjectValue){
  this.setState({
    subject: subjectValue
  })
}

displayQuestionPaper = () => {
var buffer = []
  if(this.state.response){
        buffer.push(
          <Col xs={12} sm={12} md={10} lg={8} key={new Date()}>
            <Card
            style={{borderRadius:"1.5em"}}
            >
              <CardHeader
               className="cardHeaderwithTopBorder"
                title={this.state.response.split('/').pop().split('-')[3]}
                subtitle="Question Paper"
              />
              <CardMedia>
                 <iframe title="QuestionPaper" src ={this.state.response} height="300" />
              </CardMedia>
              <CardActions>
                <div >
                <Grid fluid>
                <Row between="xs">
                <Col xs>
                <form method="post" action={this.state.response+"/download"}>
                <FlatButton type="submit" label="Download" fullWidth={true} icon={<FileFileDownload color='#30b55b' />}/>
                </form>
                </Col>
                <Col xs>
                <form method="post" action={this.state.response}>
                <FlatButton type="submit" label="Full View" fullWidth={true}  icon={<NavigationFullscreen color='#30b55b' />}/>
                </form>
                </Col>
                </Row>
                </Grid>
                </div>
              </CardActions>
            </Card>
            </Col>
          )
   }
   return buffer
}
  render(){
    if(this.props.userrole==="student")
    {
    return(
      <Grid fluid>
      <Row between="xs">
      <Col xs={12} sm={12} md={10} lg={10}>
      <div>
      <div className="QuestionPapers">
       <div >
       <br />
      <Grid fluid>
      <Row around="xs">
      <Col xs={12} sm={10} md={5} lg={5}>
      <SelectField
        floatingLabelText="Branch*"
        value={this.state.branch}
        onChange={this.handleChange}
        autoWidth={true}
      >
         <MenuItem value={1} primaryText="Select" />
         <MenuItem value={'CSE'} label="CSE" primaryText="CSE" />
       </SelectField>
       </Col>
       <Col xs={12} sm={10} md={5} lg={5}>
        <SelectField
         floatingLabelText="Year*"
          value={this.state.year}
          onChange={this.handleYearChange}
          autoWidth={true}
        >
          <MenuItem value={1} primaryText="Select" />
          <MenuItem value={'2009'} label="2009" primaryText="2009" />
          <MenuItem value={'2010'} label="2010" primaryText="2010" />
          <MenuItem value={'2011'} label="2011" primaryText="2011" />
          <MenuItem value={'2012'} label="2012" primaryText="2012" />
        </SelectField>
        </Col>
        </Row>
       </Grid>
       <br />
       <Grid fluid>
       <Row around="xs" middle="xs">
       <Col xs={12} sm={10} md={5} lg={5}>
       <SubjectAutoComplete branch={this.state.branch} type='questionpaper' handleSubjectChange={this.handleSubjectChange} />
       <br />
       </Col>
       <Col xs={12} sm={10} md={5} lg={5}>
        <FlatButton label="Fetch" className="fetchButton" value="Fetch" primary={true} onTouchTap={this.validateAndFetch} />
        </Col>
       </Row>
       </Grid>
       <br />
       </div>
       <Divider/>
        <br /> <br />
        <Grid fluid>
        <Row around="xs">
        {this.displayQuestionPaper()}
        </Row>
        </Grid>
        <br /><br />
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
DefaultQp.contextTypes = {
    router: PropTypes.object
};

export default withRouter(DefaultQp);
