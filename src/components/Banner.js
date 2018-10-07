import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';


var properties = require('./properties.json')

class Banner extends Component {

  constructor() {
    super();
     this.loginToolbar = this.loginToolbar.bind(this);
  }

componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/user/loggedin', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          if(response.status === 200){
            if(this.props.userrole === 'student')
            this.context.router.history.push('/announcements');
          }
          else if(response.status === 404)
          this.context.router.history.push('/register');
        })
}


loginToolbar(){
  var loginUrl = 'http://'+properties.getHostName+':8080/google/login'
  return(<div className="backgroundHome">
      <Grid fluid >
        <Row center="xs" >
          <Col xs={12} sm={10} md={7} lg={5}>
              <Grid fluid className="signUpForm">
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                    <h2 className="text">Beyond Class</h2>
                    <h3>Your Virtual Class room</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs>
                <form action= {loginUrl}>
                  <FlatButton type="submit" label="SignIn to workspace" className="signupButton"/> <br /><br />
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

render() {
  return(
    <div>
    {this.loginToolbar()}
    </div>
  )
}
}

Banner.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Banner);
