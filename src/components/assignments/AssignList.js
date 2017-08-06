import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {notify} from 'react-notify-toast';
import {lightBlue300} from 'material-ui/styles/colors';
import {ActionViewArray,FileFileDownload,NavigationFullscreen} from '../../styledcomponents/SvgIcons.js'
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import { Grid, Row, Cell } from 'react-inline-grid';
import styled from 'styled-components'
var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`


class AssignList extends Component{

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
     fetch('http://'+properties.getHostName+':8080/user/assignmentslist', {
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
            isLoaded : true,
            loadedsubject : this.state.subject,
            usermsg:'',
          })
          if(this.state.links.length===0)
          this.setState({
            usermsg : 'No files for this subject were found',
            isLoaded: true
          })
        })
   }

 }
 handleChange = (event, index, subject) => this.setState({subject});
  render(){

   return(
<StayVisible
{...this.props}
><br /><br />
  <div className="QpSyllabusDefault">
     <Grid>
     <Row is="center">
     <Cell is="6 tablet-6 phone-6"><div>
      <SelectField
        floatingLabelText="Subject*"
        value={this.state.subject}
        onChange={this.handleChange}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'OS'} label="OS" primaryText="Operating Systems" />
        <MenuItem value={'DM'} label="DM" primaryText="Data Mining" />
      </SelectField>
      </div></Cell>
      <Cell is="middle 6 tablet-1 phone-1"><div className="register">
       <FlatButton type="submit" label="View"  disabled={this.state.buttonDisabled} icon={<ActionViewArray color="white"/>} className="nextButton" onClick={this.handleSubmit} />
     </div></Cell>
      </Row>
      </Grid>
   </div>
   <div>
   <Grid>
   <Row is="center">
   {this.state.links.map((src, index) => (
     <Cell is="7 tablet-7"><div>
         <Card style={{borderRadius:"2em"}}>
           <CardHeader
             title="Uploaded By"
             subtitle={src.split('-').pop()}
           />
           <CardMedia>
             <iframe  title="assignments" src={src} className="iframe"/>
           </CardMedia>
           <CardTitle title={this.state.loadedsubject} subtitle="assignment" />
           <CardActions>
             <Grid>
             <Row is="start">
             <Cell is="6 tablet-6 phone-6"><div>
             <form method="post" action={src+"/download"}>
             <FlatButton type="submit" label="Download" fullWidth={true} icon={<FileFileDownload color={lightBlue300} />}/>
             </form>
             </div></Cell>
             <Cell is="6 tablet-6 phone-6"><div>
             <form method="post" action={src}>
             <FlatButton type="submit" label="View" fullWidth={true} icon={<NavigationFullscreen color={lightBlue300} />}/>
             </form>
             </div></Cell>
             </Row>
             </Grid>
           </CardActions>
         </Card>
      </div></Cell>
  ))}
  </Row>
  </Grid>
  <p style={{textAlign:"center"}}>
  {this.state.usermsg}
  </p>
  </div>
  </StayVisible>
   )
  }
}
export default AssignList;
