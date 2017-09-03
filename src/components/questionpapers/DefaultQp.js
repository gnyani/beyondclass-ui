import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import {notify} from 'react-notify-toast';
import MenuItem from 'material-ui/MenuItem';
import {lightBlue300} from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {FileFileDownload,NavigationFullscreen} from '../../styledcomponents/SvgIcons.js';
import '../../styles/student-adda.css';
import { Grid, Row, Col } from 'react-flexbox-grid';
import UnauthorizedPage from '../UnauthorizedPage.js'
var properties = require('../properties.json');


class DefaultQp extends Component{

   constructor(){
     super();
     this.state = {
       value : 1,
       year : 1,
       response : '',
       image: [],
       isLoaded : false,
       photoIndex: 0,
       isOpen: false
     }
     this.validateAndFetch = this.validateAndFetch.bind(this);
     this.fetchQp = this.fetchQp.bind(this);
     this.image = this.image.bind(this);
   }

validateAndFetch(){
  if(this.state.value === 1)
  {
    notify.show("please fill in all the mandatory fields which are followed by *");
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
         subject: this.state.value,
         qpyear : this.state.year,
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
         isLoaded : true
       },function(){this.image()})
     })
}

handleChange = (event, index, value) => this.setState({value});
handleYearChange = (event, index, year) => this.setState({year});
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
          <Col xs={12} sm={12} md={10} lg={8} key={new Date()}>
            <Card
            style={{borderRadius:"1.5em"}}
            >
              <CardHeader
                title={this.state.value}
                subtitle="Question Paper"
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
  render(){
    if(this.props.userrole==="student")
    {
    return(
      <Grid fluid>
      <Row around="xs">
      <Col xs={12} sm={12} md={10} lg={10}>
      <div>
      <div className="QuestionPapers">
       <div >
       <br />
      <Grid fluid>
      <Row around="xs">
      <Col xs={5} sm={5} md={5} lg={5}>
      <SelectField
        floatingLabelText="Subject*"
        value={this.state.value}
        onChange={this.handleChange}
        style={{width: "50%"}}
      >
         <MenuItem value={1} primaryText="Select" />
         <MenuItem value={'OS'} label="OS" primaryText="Operating Systems" />
         <MenuItem value={'DM'} label="DM" primaryText="Data Mining" />
       </SelectField>
       </Col>
       <Col xs={5} sm={5} md={5} lg={5}>
        <SelectField
         floatingLabelText="Year*"
          value={this.state.year}
          onChange={this.handleYearChange}
          style={{width:"50%"}}
        >
          <MenuItem value={1} primaryText="Select" />
          <MenuItem value={'2015'} label="2015" primaryText="2015" />
          <MenuItem value={'2016'} label="2016" primaryText="2016" />
        </SelectField>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2}>
         <FlatButton label="Fetch" className="fetchButton" value="Fetch" primary={true} onTouchTap={this.validateAndFetch} />
         </Col>
        </Row>
       </Grid>
       </div>
       <Divider/>
        <br /> <br />
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

export default DefaultQp;
