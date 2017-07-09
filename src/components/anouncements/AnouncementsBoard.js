import React, { Component } from 'react';
import {notify} from 'react-notify-toast';
import Paper from 'material-ui/Paper';
import {blue500,lightBlue300,redA700,yellowA200} from 'material-ui/styles/colors';
//import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import Pagination from 'material-ui-pagination';
//import { Grid, Row, Cell } from 'react-inline-grid';

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

const fontStyle={
  fontFamily: "'Comic Sans MS',sans-serif",
  fontSize:'140%',
  fontStyle: 'italic',
  fontWeight: '500',
  letterSpacing: '2px',
  wordWrap: 'break-word',
  width:'100%',
  height:'150%',
  textTransform: 'uppercase',
  color: blue500
}

const messageStyle={
  fontFamily: "'Comic Sans MS',sans-serif",
  fontSize:'120%',
  fontStyle: 'italic',
  fontWeight: '500',
  wordWrap: 'break-word',
  width:'75%',
  letterSpacing: '2px',
  textTransform: 'capitalize',
  color: redA700

}
class AnouncementsBoard extends Component{

  constructor() {
    super();
    this.state={
      users : [],
      messages : [],
      message: '',
      response:'',
      total: 20,
      display: 7,
      number: 1,
      buttonDisabled: false
    }
    this.list = this.list.bind(this);
    this.populateData = this.populateData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
}

handleSubmit(){
   this.setState({
     buttonDisabled: true
   })
  fetch('http://localhost:8080/user/anouncements/insert', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         message: this.state.message,
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
         users : [],
         messages : [],
         message:''
       })
       this.populateData(1)
       this.setState({
         response : response,
         buttonDisabled  : false,
       })
       notify.show("file upload successful","success")
       console.log(this.state.response)
     })
}

list(buffer){
  var i=0;
  for (i=0;i<this.state.users.length;i++){
  buffer.push(
              <div key={i} style={{display:'flex'}}>
              <br /><br />
               <li> <p style={fontStyle}> {this.state.users[i]} : </p> </li>
               <br /> <br /><br />
               <p style={messageStyle}> {this.state.messages[i]} </p><br />
              </div>
             )
  }
  return buffer
}

populateData(pageNumber){
  fetch('http://localhost:8080/user/anouncements/list?pageNumber='+pageNumber, {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          console.log("status is" + response.status);
        //  console.log("response without json is" + response.text())
          return response.json()
        }).then(response => {
          console.log("response content is" + JSON.stringify(response.content.length))
          var newmessage = this.state.messages.slice()
          var newuser = this.state.users.slice()
          for(let i=0;i<response.content.length;i++)
           {
             newmessage.push(response.content[i].message)
             newuser.push(response.content[i].username)
          }
           this.setState({
               users: newuser,
               messages: newmessage
         })
         console.log("users" + typeof this.state.users[0],"messages" + this.state.messages[0])
        })
}

componentWillMount(){
  this.populateData(1)
}

handlePageChange(number){
 this.setState({
   number: number,
   users:[],
   messages:[],
   message : '',
 })
 this.populateData(number);
}

handleChange = (e) => this.setState({message:e.target.value});

render(){
var buffer=[];
console.log("props"+JSON.stringify(this.props.width))
return(

<StayVisible
  {...this.props}
>
<div  >
    <h2 style={{textAlign:'center',fontSize:'150%'}}> Latest Anouncements </h2>
    <br />
   <Paper zDepth={2}  style={{height:'600px',width:'75%',marginLeft:'10%',backgroundColor:yellowA200}}>
      <br />
      <ul style={{marginLeft:'5%'}}> {this.list(buffer)} </ul>
    </Paper>
<Paper zDepth={2}  style={{height:'40px',width:'75%',marginLeft:'10%',backgroundColor:lightBlue300}} >
    <div
      style = { {
        width: '75%',
        marginLeft:'30%',
      } }
    >
    <Pagination
    total = { this.state.total }
    current = { this.state.number }
    display = { this.state.display }
    onChange = { this.handlePageChange}
    />
    </div>
  </Paper>
  <Paper zDepth={2}  style={{height:'100px',width:'75%',marginLeft:'10%'}}>
  <div style={{display:'flex'}} >
    <TextField
      hintText="Anounce a message"
      multiLine={true}
      value={this.state.message}
      floatingLabelText="Cannot exceed more than 200 chars"
      floatingLabelFixed={true}
      maxLength="200"
      rows={2}
      onChange={this.handleChange}
      style={{width:'75%',marginLeft:'15px'}}
    />
    <FlatButton label="Anounce"  disabled={this.state.buttonDisabled}
     style={{marginLeft:'25px',marginTop:'30px'}} onTouchTap={this.handleSubmit}/>
  </div>
  </Paper>
</div>
</StayVisible>
);

}
}

export default AnouncementsBoard;
