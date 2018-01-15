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



loginToolbar(){
  var loginUrl = 'http://'+properties.getHostName+':8080/google/login'
  return(<div className="backgroundHome">
      <Grid fluid >
        <Row center="xs" >
          <Col xs={12} sm={10} md={7} lg={5}>
              <Grid fluid className="signUpForm">
                <Row center="xs">
                    <Col xs={6} sm={6} md={5} lg={5}>
                    <div >
                      <div className="studentAddaLogoContainer">
                           B
                      </div>
                      </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                    <h2 className="text">Welcome to Beyond Class<br></br><span>Your Virtual Class room</span></h2>
                    </Col>
                </Row>
                <Row>
                    <Col xs>
                <form action= {loginUrl}>
                  <FlatButton type="submit" label="SignIn/Signup" className="signupButton"/> <br /><br />
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
