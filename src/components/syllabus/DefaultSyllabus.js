import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {notify} from 'react-notify-toast';
import MenuItem from 'material-ui/MenuItem';
// import { Image } from 'material-ui-image';
// import Img from 'react-image';
// import Spinner from 'react-spinner';
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
  console.log("value of sub is" + this.state.value)
  if(this.state.value === 1)
  {
    console.log("inside if")
    notify.show("please select a subject");
  }
  else{
    console.log("in else")
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
       console.log("response text is" + response)
       this.setState({
         response : response,
         isLoaded : true
       })
       console.log(this.state.response)
     })
}

handleChange = (event, index, subject) => this.setState({subject});

  render(){
    return(
  <StayVisible
  {...this.props}
  >
    <div>
     <div >
       <div style={{textAlign:'center'}}>
       <br />
       <br />
       <br />
      <Paper zDepth={2} style={{marginLeft:'18%',width: '60%'}}  >
       <br />
       <h4 style={{width: '100%'}}> choose a subject </h4>
      <Grid>
      <Row is="center">
      <Cell is="middle 4 tablet-2"><div>
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
       </Row>
       </Grid>
       <RaisedButton label="Fetch" value="Fetch" primary={true} onTouchTap={this.validateAndFetch} />
       </Paper>
       </div>
        <br /> <br /> <br />
    </div>
    <iframe src = {this.state.response} title="pdf syllabus" style={{marginLeft:'18%',height: '400px' ,width : '60%' , frameborder: '1'}} ></iframe>
    </div>
    </StayVisible>
    )
  }
}

export default DefaultQp;
