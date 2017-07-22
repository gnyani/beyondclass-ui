import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import {notify} from 'react-notify-toast';
import MenuItem from 'material-ui/MenuItem';
import '../../styles/student-adda.css';
import { Grid, Row, Cell } from 'react-inline-grid';
import styled from 'styled-components'

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
       isLoaded : false
     }
     this.validateAndFetch = this.validateAndFetch.bind(this);
     this.fetchSyllabus = this.fetchSyllabus.bind(this);
   }

validateAndFetch(){
  if(this.state.value === 1)
  {
    notify.show("please select a subject");
  }
  else{
    notify.show("success","success");
    this.fetchSyllabus();
  }
}

fetchSyllabus(){

  fetch('http://localhost:8080/user/syllabusurl', {
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
       })
     })
}

handleChange = (event, index, subject) => this.setState({subject});

  render(){
    return(
  <StayVisible
  {...this.props}
  >
    <div className="Syllabus">
       <div >
       <br />
       <br />
       <br />
      <Grid>
      <Row is="center">
      <Cell is="middle 2 tablet-2"><div>
      <label>  Subject: </label>
      </div></Cell>
      <Cell is="3 tablet-2 phone-2"><div>
       <DropDownMenu
         value={this.state.subject}
         onChange={this.handleChange}
         autoWidth={true}
       >
         <MenuItem value={1} primaryText="Select*" />
         <MenuItem value={'DS'} label="DS" primaryText="Data Structures" />
         <MenuItem value={'OS'} label="OS" primaryText="Operating Systems" />
         <MenuItem value={'DM'} label="DM" primaryText="Data Mining" />
       </DropDownMenu>
       </div></Cell>
       <Cell is="middle 3 tablet-2 phone-2"><div>
       <RaisedButton label="Fetch" value="Fetch" primary={true} onTouchTap={this.validateAndFetch} />
       </div></Cell>
       </Row>
       </Grid>
<Divider />
       </div>
        <br /> <br /> <br />
    <iframe src = {this.state.response} title="pdf syllabus" className="iframe" ></iframe>
    </div>
    </StayVisible>
    )
  }
}

export default DefaultQp;
