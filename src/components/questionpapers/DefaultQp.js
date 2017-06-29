import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {notify} from 'react-notify-toast';
import MenuItem from 'material-ui/MenuItem';
import { Image } from 'material-ui-image';
// import Img from 'react-image';
// import Spinner from 'react-spinner';
import { Grid, Row, Cell } from 'react-inline-grid';

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
   }

validateAndFetch(){
  console.log("value of sub is" + this.state.value)
  if(this.state.value === 1)
  {
    console.log("inside if")
    notify.show("please fill in all the mandatory fields which are followed by *");
  }
  else{
    console.log("in else")
    notify.show("success","success");
    this.fetchQp();
  }
}

fetchQp(){

  fetch('http://localhost:8080/user/questionpaperurl', {
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
       console.log("response text is" + response)
       this.setState({
         response : response,
         isLoaded : true
       })
       console.log(this.state.response)
     })
}

handleChange = (event, index, value) => this.setState({value});
handleYearChange = (event, index, year) => this.setState({year});

  render(){
    return(
     <div >
       <div style={{textAlign:'center'}}>
       <br />
       <br />
       <br />
      <Paper zDepth={2} style={{width: '200%',borderRadius:'13%'}}  >
       <br />
       <h4 style={{width: '100%'}}> choose a subject </h4>
      <Grid>
      <Row is="center">
      <Cell is="middle 4 tablet-2"><div>
      <label>  Subject: </label>
      </div></Cell>
      <Cell is="3 tablet-2 phone-2"><div>
       <DropDownMenu
         value={this.state.value}
         onChange={this.handleChange}
         autoWidth={true}
       >
         <MenuItem value={1} primaryText="Select*" />
         <MenuItem value={'OS'} label="OS" primaryText="Operating Systems" />
         <MenuItem value={'DM'} label="DM" primaryText="Data Mining" />
       </DropDownMenu>
       </div></Cell>
       </Row>
       </Grid>
       <Grid>
       <Row is="center">
       <Cell is="middle 4 tablet-2"><div>
       <label>  Year : </label>
       </div></Cell>
       <Cell is="3 tablet-2 phone-2"><div>
        <DropDownMenu
          value={this.state.year}
          onChange={this.handleYearChange}
          autoWidth={true}
        >
          <MenuItem value={1} primaryText="Select*" />
          <MenuItem value={'2015'} label="2015" primaryText="2015" />
          <MenuItem value={'2016'} label="2016" primaryText="2016" />
        </DropDownMenu>
        </div></Cell>
        </Row>
       </Grid>
       <RaisedButton label="Fetch" value="Fetch" primary={true} onTouchTap={this.validateAndFetch} />
       </Paper>
       </div>
        <br /> <br /> <br /> <br />
       <Image src = {this.state.response} style={{width: '140%',height: '140%'}} loadingStyle={{position: 'absolute'}} loadingSize={150}/>
    </div>
    )
  }
}

export default DefaultQp;
