import React, { Component } from 'react';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper';
import {notify} from 'react-notify-toast';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import CustomAvatar from '../styledcomponents/CustomAvatar.js'
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import { Grid, Row, Col } from 'react-flexbox-grid';


var properties = require('./properties.json')

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
  fetch('http://'+properties.getHostName+':8080/user/isloggedin', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          return response.text()
        }).then(response => {
          this.setState({
            isLoggedIn : 'true',
            isLoaded : 'true'
          })
        })
  }


  handleLogout(){
    fetch('http://'+properties.getHostName+':8080/user/logout', {
             credentials: 'include',
             method: 'GET'
          }).then(response => {
             return response.text()
          }).then(response => {
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
  var loginUrl = 'http://'+properties.getHostName+':8080/google/login'
  return(<div className="backgroundHome">
      <Grid fluid className="h-100">
        <Row className="h-100">
          <Col xs={12} sm={6} md={4} mdOffset={4} smOffset={3}>
              <Grid fluid className="signUpForm">
                <Row>
                    <Col xs={4} sm={6} md={3} mdOffset={5} smOffset={3} xsOffset={4}>
                    <div className="bannerFirstChild">
                      <div className="studentAddaLogoContainer">
                          <CustomAvatar />
                      </div>
                      </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12}>
                    <h2 className="text">SignIn to StudenhtAdda<br></br><span>Your Virtual Class room</span></h2>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={4} mdOffset={4} xsOffset={2} className="text">
                <form action= {loginUrl}>
                <div className="signupButtonDiv">
                  <button className="signUpButton">
                  <div className="signupButtonDiv2">
                  <span className="signupButtonText">Signup/SignIn</span>
                  </div>
                  </button>
                  </div>
                </form>
                </Col>
            </Row>
              </Grid>
          </Col>
        </Row>
      </Grid>
      </div>
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
     <Badge
      badgeContent={10}
      secondary={true}
      badgeStyle={{top: 18, right: 12}}
     >
     <IconButton tooltip="Notifications">
       <NotificationsIcon />
     </IconButton>
   </Badge>
     <RaisedButton  label="Logout" value="logout" primary={true} onTouchTap={this.handleLogout}/>
     </ToolbarGroup>
   </Toolbar>
</Paper>
)
}
render() {
if(!this.state.isLoaded){
  return <CircularProgress />;
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
