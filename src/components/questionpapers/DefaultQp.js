import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import {notify} from 'react-notify-toast';
import MenuItem from 'material-ui/MenuItem';
import '../../styles/student-adda.css';
import { Grid, Row, Cell } from 'react-inline-grid';
import styled from 'styled-components'
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
       value : 1,
       year : 1,
       response : '',
       isLoaded : false
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
         notify.show("Retrieval Successful","success");
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

handleChange = (event, index, value) => this.setState({value});
handleYearChange = (event, index, year) => this.setState({year});
image(){

  if(this.state.response){
    var obj = new Image();
      obj.src = this.state.response
      if(obj.complete){
           return(<img alt="loading" src = {this.state.response} className="image"/>)
      }else{

        return(<p>Sorry no records found for this subject</p>);
      }
   }
}
  render(){
    return(
    <StayVisible
    {...this.props}
    >
     <div className="QuestionPapers">
       <div >
       <br />
       <br />
       <br />
      <Grid>
      <Row is="center">
      <Cell is="1 tablet-2"><div >
      <label>  Subject: </label>
      </div></Cell>
      <Cell is="2 tablet-2 phone-2"><div>
       <DropDownMenu
         value={this.state.value}
         onChange={this.handleChange}
         autoWidth={true}
         className="DropDownMenu"
       >
         <MenuItem value={1} primaryText="Select*" />
         <MenuItem value={'OS'} label="OS" primaryText="Operating Systems" />
         <MenuItem value={'DM'} label="DM" primaryText="Data Mining" />
       </DropDownMenu>
       </div></Cell>
       <Cell is="1 tablet-2"><div>
       <label>  Year : </label>
       </div></Cell>
       <Cell is="2 tablet-2 phone-2"><div>
        <DropDownMenu
          value={this.state.year}
          onChange={this.handleYearChange}
          autoWidth={true}
          className="DropDownMenu"
        >
          <MenuItem value={1} primaryText="Select*" />
          <MenuItem value={'2015'} label="2015" primaryText="2015" />
          <MenuItem value={'2016'} label="2016" primaryText="2016" />
        </DropDownMenu>
        </div></Cell>
        <Cell is="1 tablet-2 phone-2"><div>
         <RaisedButton label="Fetch" value="Fetch" primary={true} onTouchTap={this.validateAndFetch} />
         </div></Cell>
        </Row>
       </Grid>
       </div>
<Divider/>
        <br /> <br />
        {this.image.bind(this)}
         <br />
    </div>
       <br /> <br /> <br />
    </StayVisible>
    )
  }
}

export default DefaultQp;
