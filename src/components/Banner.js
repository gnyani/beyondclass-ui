import React, { Component } from 'react';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';
import LoadingComponent from './loading.js'
import Paper from 'material-ui/Paper';
import {notify} from 'react-notify-toast';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';

import CustomAvatar from '../styledcomponents/CustomAvatar.js'

class Banner extends Component {

  constructor() {
    super();
    this.state = {
      isLoggedIn: 'false',
      isLoaded : 'false' ,
    }
     this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
     this.handleLogout = this.handleLogout.bind(this);
     this.loginToolbar = this.loginToolbar.bind(this);
     this.logoutToolbar = this.logoutToolbar.bind(this);
  }


  componentWillMount(){
  this.isUserLoggedIn()
  }

  isUserLoggedIn(){
  fetch('http://localhost:8080/user/isloggedin', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          console.log("status is" + response.status);
        //  console.log("response without json is" + response.text())
          return response.text()
        }).then(response => {
          console.log("response from userLoggedin "+response);
          this.setState({
            isLoggedIn : 'true',
            isLoaded : 'true'
          })
      //    this.state.isLoggedIn = 'true'
          console.log("current state is" + this.state.isLoggedIn)
        })
  }


  handleLogout(){
    fetch('http://localhost:8080/user/logout', {
             credentials: 'include',
             method: 'GET'
          }).then(response => {
            console.log("status is" + response.status);
          //  console.log("response without json is" + response.text())
             return response.text()
          }).then(response => {
            console.log("response is"+response);
            if(response){
              let myColor = { background: '#0E1717', text: "#FFFFFF" };
              notify.show('Logout Successful!','success',3000,myColor);
              this.setState({
                isLoggedIn : 'false',
                isLoaded : 'true'
              })
              this.context.router.history.push('/');
            }
          })
    }

loginToolbar(){
  return(
<Paper zDepth={2}>
<div>
   <Toolbar  style={{
      backgroundColor:'#2962ff',
      noGutter: true
  }}>
      <ToolbarGroup firstChild={true}>
        <ListItem
          disabled={true}
          leftAvatar={
            <CustomAvatar />
          }
        ></ListItem>
        <ToolbarTitle text="StudentAdda" style={{color:'#ffffff'}}/>
      </ToolbarGroup>
      <ToolbarGroup>
      <form action="http://localhost:8080/google/login">
        <RaisedButton type="submit" label="Login/Signup" value="login" primary={true} />
      </form>
      </ToolbarGroup>
    </Toolbar>
</div>
</Paper>
  )
}

logoutToolbar(){
 return(
<Paper zDepth={2}>
  <Toolbar  style={{
   backgroundColor:'#2962ff',
   noGutter: true
 }}>
     <ToolbarGroup firstChild={true}>
       <ListItem
         disabled={true}
         leftAvatar={
           <CustomAvatar />
         }
       ></ListItem>
       <ToolbarTitle text="StudentAdda" style={{color:'#ffffff'}}/>
     </ToolbarGroup>
     <ToolbarGroup>
     <RaisedButton  label="Logout" value="logout" primary={true} onTouchTap={this.handleLogout}/>
     </ToolbarGroup>
   </Toolbar>
</Paper>
)
}
render() {
console.log("is user logged in " +this.state.isLoggedIn+" is data loaded" + this.state.isLoaded);
if(!this.state.isLoaded){
  return <LoadingComponent />;
}
else if(this.state.isLoggedIn === 'true'){
return(
  <div>
  {this.logoutToolbar()}
  </div>
)
}
else{
  return(
    <div>
    {this.loginToolbar()}
    </div>
  )
}
}
}

Banner.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Banner);
