import React, {Component} from 'react'
import '../anouncements/Announcements.css'
import ContactUs from '../issues/ContactUs.js'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast';
import RaisedButton from 'material-ui/RaisedButton'
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

var properties = require('../properties.json');

class RegisterTemp extends Component{

  logoutSession = () => {
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
          }).catch(response => {
          notify.show("Please login your session expired","error");
          this.context.router.history.push('/');
         });
  }

  render(){
    return(
      <Grid fluid>
      <br /><br />
      <Row center="xs">
      <Col xs={4} sm={4} md={3} lg={3}>
      <RaisedButton key={1} label="Logout" primary={true} onClick={this.logoutSession} />
      </Col>
      </Row>
      <Row center = "xs">
      <Col xs={11} sm={11} md={9} lg={8}>
      <div >
      <h4 className="fontreq">Your email Id is not registered with BeyondClass yet!!, Please contact us</h4>
      </div>
      </Col>
      </Row>
      <Row around="xs" className="announcements">
      <Col xs={11} sm={11} md={7} lg={7}>
      <ContactUs />
      </Col>
      </Row>
      </Grid>
    )
  }
}

RegisterTemp.contextTypes = {
    router: PropTypes.object
};

export default withRouter(RegisterTemp)
