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
import { Grid, Row, Cell } from 'react-inline-grid';
import styled from 'styled-components';
import UnauthorizedPage from '../UnauthorizedPage.js'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

class DefaultQp extends Component{

   constructor(){
     super();
     this.state = {
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
         subject: this.state.subject
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
       },function(){
         this.image()
       })
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
          <Cell is="7 tablet-7" key={new Date()}><div>
            <Card
            style={{borderRadius:"1.5em"}}
            >
              <CardHeader
                title={this.state.subject}
                subtitle="Syllabus"
              />
              <CardMedia>
                 <img alt="loading" src ={obj.src} className="image" />
              </CardMedia>
              <CardActions>
                <div >
                <Grid>
                <Row is="start">
                <Cell is="stretch 6 tablet-6"><div>
                <form method="post" action={obj.src+"/download"}>
                <FlatButton type="submit" label="Download" fullWidth={true} icon={<FileFileDownload color={lightBlue300} />}/>
                </form>
                </div></Cell>
                <Cell is="stretch 6 tablet-6"><div>
                <FlatButton type="submit" label="Full View" fullWidth={true}  onClick={() => this.setState({ isOpen: true })} icon={<NavigationFullscreen color={lightBlue300} />}/>
                </div></Cell>
                </Row>
                </Grid>
                </div>
              </CardActions>
            </Card>
            </div></Cell>
          )
        this.setState({
          image: x.slice(),
        })
        notify.show("Retrieval Successful","success");
      }
   }
}

handleChange = (event, index, subject) => this.setState({subject});

  render(){
  if(this.props.userrole==="student")
  {
    return(
  <StayVisible
  {...this.props}
  >
    <div className="Syllabus">
       <div >
       <br />
      <Grid>
      <Row is="center">
      <Cell is="4 tablet-4 phone-4"><div>
       <SelectField
        floatingLabelText="Subject*"
         value={this.state.subject}
         onChange={this.handleChange}
         style={{width: "50%"}}
       >
         <MenuItem value={1} primaryText="Select*" />
         <MenuItem value={'DS'} label="DS" primaryText="Data Structures" />
         <MenuItem value={'OS'} label="OS" primaryText="Operating Systems" />
         <MenuItem value={'DM'} label="DM" primaryText="Data Mining" />
       </SelectField>
       </div></Cell>
       <Cell is="middle 3 tablet-3 phone-3"><div>
       <FlatButton label="Fetch" value="Fetch" primary={true} className="fetchButton" onTouchTap={this.validateAndFetch} />
       </div></Cell>
       </Row>
       </Grid>
<Divider />
       </div>
        <br /> <br /> <br />
        <Grid>
        <Row is="center">
        {this.state.image}
        </Row>
        </Grid>
    </div>
    </StayVisible>
    )
  }
  else{
    return(<UnauthorizedPage />)
  }
}
}

export default DefaultQp;
