import React, { Component } from 'react';
import {notify} from 'react-notify-toast';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import Pagination from 'material-ui-pagination';
import{Row,Grid,Cell} from 'react-inline-grid';
import '../../styles/student-adda.css';

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

class AnouncementsBoard extends Component{

  constructor() {
    super();
    this.state={
      users : [],
      messages : [],
      message: '',
      response:'',
      total: 3,
      display: 7,
      number: 1,
      buttonDisabled: false
    }
    this.list = this.list.bind(this);
    this.populateData = this.populateData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.Enter = this.Enter.bind(this);
}

handleSubmit(){
   this.setState({
     buttonDisabled: true
   })
   var trimmedmessage = this.state.message.replace(/\s/g,'')
   if(trimmedmessage===''){
    notify.show("Message cannot be null","error");
   }else{
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
         number : 1,
         buttonDisabled  : false,
       })
       notify.show("Anouncement uploaded successfully","success")
       console.log(this.state.response)
     })}
}

list(buffer){
  var i=0;
  for (i=0;i<this.state.users.length;i++){
  buffer.push(<li key={i}>
                <p className="name"> <span className="fontStyle">{this.state.users[i]} </span>: <span className="messageStyle">{this.state.messages[i]}</span> </p></li>
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
               messages: newmessage,
               total: response.totalPages
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

Enter(event){
  if(event.key === 'Enter'){
    this.handleSubmit();
  }
}

render(){
var buffer=[];
console.log("props"+JSON.stringify(this.props.width))
return(

<StayVisible
  {...this.props}
>
<div className="announcements ">
    <Grid>
    <Row is="center">
    <Cell is="middle 1 tablet-1"><div>
    <img  className="image" src={require('../../styledcomponents/images/announcements.jpeg')} alt="Problem loading"/>
    </div></Cell>
    <Cell is="6 tablet-5"><div>
    <h2 className="heading"> Latest Announcements</h2>
    </div></Cell>
    </Row>
    </Grid>
   <div  className="container page">
      <ul> {this.list(buffer)} </ul>
    </div>
    <Pagination
    total = { this.state.total }
    current = { this.state.number }
    display = { this.state.display }
    onChange = { this.handlePageChange}
    />


    <TextField
     value = {this.state.message}
     onChange = {this.handleChange}
     hintText = "Give an anouncement"
     className="input"
     onKeyPress={this.Enter}
     />

    <FlatButton label="Announce" type="submit"  disabled={this.state.buttonDisabled}
     className="AnnounceButton" onTouchTap={this.handleSubmit}/>
</div>
</StayVisible>
);

}
}

export default AnouncementsBoard;
